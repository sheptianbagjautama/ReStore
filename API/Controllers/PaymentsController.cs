using API.Data;
using API.Dtos;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentsService paymentsService;
        private readonly StoreContext storeContext;
        private readonly IConfiguration configuration;
        private readonly ILogger<PaymentsController> logger;

        public PaymentsController(PaymentsService paymentsService, StoreContext storeContext, IConfiguration configuration, ILogger<PaymentsController> logger)
        {
            this.paymentsService = paymentsService;
            this.storeContext = storeContext;
            this.configuration = configuration;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent() 
        {
            var basket = await storeContext.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

            if(basket == null) return BadRequest("Problem with the basket");

            var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

            if(intent == null) return BadRequest("Problem createing payment intent");

            //jika PaymentIntentId dan ClientSecret kosong 
            //makan akan ditambahkan dengan nilai dari intent field id dan client secret
            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            if(storeContext.ChangeTracker.HasChanges()){
                 var result = await storeContext.SaveChangesAsync() > 0;
            
                if(!result) return BadRequest("Problem updating basket with intent");
            }
            
            return basket.ToDto();
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync(); 

            try
            {
                var stripeEvent = ConstructStripeEvent(json);

                if(stripeEvent.Data.Object is not PaymentIntent intent) {
                    return BadRequest("Invalid event data");
                }

                if(intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
                else await HandlePaymentIntentFailed(intent);

                return Ok();
            }
            catch (StripeException ex)
            {
                logger.LogError(ex, "Stripe webhook error");
                return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
            }
            catch(Exception ex) {
                logger.LogError(ex, "An Unexpected error has occurred");
                return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");
            }
        }

        private async Task HandlePaymentIntentFailed(PaymentIntent intent)
        {
            var order = await storeContext.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");

            foreach (var item in order.OrderItems)
            {
                var productItem = await storeContext.Products
                    .FindAsync(item.ItemOrdered.ProductId)
                    ?? throw new Exception("Problem updating order stock");

                productItem.QuantityInStock += item.Quantity;
            }

            order.OrderStatus = OrderStatus.PaymentFailed;

            await storeContext.SaveChangesAsync();
        }

        private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
        {
            var order = await storeContext.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");

                if(order.GetTotal() != intent.Amount) {
                    order.OrderStatus = OrderStatus.PaymentMismatch;
                } else {
                    order.OrderStatus = OrderStatus.PaymentReceived;
                }

                var basket = await storeContext.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);

                if(basket != null) storeContext.Baskets.Remove(basket);

                await storeContext.SaveChangesAsync();
        }

        private Event ConstructStripeEvent(string json)
        {
            try
            {
                return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], configuration["StripeSettings:WhSecret"]);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to construct stripe event");
                throw new StripeException("Invalid signature");
            }
        }
    }
}
