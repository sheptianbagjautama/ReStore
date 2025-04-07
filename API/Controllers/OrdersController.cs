using System;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrdersController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetOrders()
    {
        var orders = await context.Orders
       .Include(x => x.OrderItems)
       .Where(x => x.BuyerEmail == User.GetUsername())
       .ToListAsync();

        return orders;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrderDetails(int id)
    {
        var order = await context.Orders
            .Where(x => x.BuyerEmail == User.GetUsername() && id == x.Id)
            .FirstOrDefaultAsync();

        if (order == null) return NotFound();

        return order;
    }

    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

        if(basket == null || basket.Items.Count == 0) 
            return BadRequest("Basket is empty or not found.");

        var items = CreateOrderItems(basket.Items);

        var subtotal = items.Sum(x => x.Price * x.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);

        var order = new Order
        {
            OrderItems = items,
            BuyerEmail  = User.GetUsername(),
            ShippingAddress = orderDto.ShippingAddress,
            DeliveryFee = deliveryFee,
            Subtotal = subtotal,
            PaymentSummary = orderDto.PaymentSummary,
            PaymentIntentId = basket.PaymentIntentId
        };

        context.Orders.Add(order);
        context.Baskets.Remove(basket);
        Response.Cookies.Delete("basketId");

        var result = await context.SaveChangesAsync() > 0;

        return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id}, order);
    }

    private long CalculateDeliveryFee(long subtotal)
    {
        throw new NotImplementedException();
    }

    private List<OrderItem> CreateOrderItems(List<BasketItem> items)
    {
        throw new NotImplementedException();
    }
}
