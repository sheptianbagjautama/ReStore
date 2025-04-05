using System;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options) { 
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
    public required DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        //Membuat data role
        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole {Id="325aa87c-ee31-4e7f-8c91-bb36f156de50" , Name="Member", NormalizedName="MEMBER"},
                new IdentityRole {Id="88a84d79-1175-4d2a-b6ac-6cfa8cdb0e1e" , Name="Admin", NormalizedName="ADMIN"}
            );
    }
}