using API.Data;
using API.Dtos;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentsService paymentsService;
        private readonly StoreContext storeContext;

        public PaymentsController(PaymentsService paymentsService, StoreContext storeContext)
        {
            this.paymentsService = paymentsService;
            this.storeContext = storeContext;
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

            var result = await storeContext.SaveChangesAsync() > 0;
            
            if(!result) return BadRequest("Problem updating basket with intent");

            return basket.ToDto();
        }


    }
}
