using System;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // This attribute indicates that the class is an owned entity type in Entity Framework Core.
public class ProductItemOrdered
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public required string PictureUrl { get; set; }
}
