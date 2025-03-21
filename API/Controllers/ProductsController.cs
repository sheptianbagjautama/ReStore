using API.Data;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Product>>>  GetProducts(
            string? orderBy,
            string searchTerm){

            var query = context.Products
                .Sort(orderBy)
                .Search(searchTerm)
                .AsQueryable();
            
            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id){
            var product = await context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
        }
    }
}
