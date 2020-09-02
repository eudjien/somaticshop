using AutoMapper;
using Core.Dto;
using Core.Entities;
using Core.Identity.Entities;
using Core.Interfaces.Repositories;
using Core.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web
{
    public static class DbSeed
    {
        public static async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            await roleManager.CreateAsync(new Role("Admin"));
        }

        public static async Task UsersAsync(IServiceProvider serviceProvider)
        {

            const string PASSWORD = "root";

            var userService = serviceProvider.GetRequiredService<UserService>();

            var users = new[] {
                new User("VasyaPupkin") { FirstName = "Vasya", LastName = "Pupkin", Email = "vasya@pupk.in", EmailConfirmed = true },
                new User("PetyaPetrov") { FirstName = "Petya", LastName = "Petrov" },
                new User("OlegOlegovich") { FirstName = "Oleg", LastName = "Olegovich" },
                new User("DenisDenisovich") { FirstName = "Denis", LastName = "Denisovich" },
                new User("MaksimMaksimovich") { FirstName = "Maksim", LastName = "Maksimovich" },
                new User("IvanIvanov") { FirstName = "Ivan", LastName = "Ivanov" },
            };

            foreach (var user in users)
            {
                await userService.UserManager.CreateAsync(user, PASSWORD);
            }
        }

        public static async Task BrandsAsync(IServiceProvider serviceProvider)
        {

            var brandRepository = serviceProvider.GetRequiredService<IBrandRepository>();

            var brands = new[] {
                new Brand("Shimano", null),
                new Brand("SRAM", null),
                new Brand("Continental", null),
                new Brand("Maxxis", null),
                new Brand("FOX", null),
                new Brand("RockShox", null),
                new Brand("Cube", null),
                new Brand("Specialized", null),
                new Brand("FUNN", null),
                new Brand("Crankbrothers", null),
                new Brand("Park Tool", null),
                new Brand("Schwable", null),
                new Brand("Mavic", null),
                new Brand("WTB", null),
                new Brand("Tektro", null),
                new Brand("KMC", null),
                new Brand("Santa Cruz", null),
                new Brand("Renthal", null),
                new Brand("PFR", null),
                new Brand("Sixpack Racing", null),
                new Brand("Hope", null),
                new Brand("Katana", null),
                new Brand("absoluteBLACK", null),
                new Brand("Ergon", null),
                new Brand("SQlab", null)
            };

            brandRepository.AddRange(brands);

            await brandRepository.SaveChangesAsync();
        }

        public static async Task CatalogsAsync(IServiceProvider serviceProvider)
        {

            var catalogRepository = serviceProvider.GetRequiredService<ICatalogRepository>();

            var catalogs = new[] {
                new Catalog {
                    Title = "Покрышки",
                },
                new Catalog {
                    Title = "Переключатели",
                    ChildCatalogs = new List<Catalog> {
                        new Catalog
                        {
                            Title = "Задние переключатели",
                        },
                        new Catalog
                        {
                            Title = "Передние переключатели",
                        },
                    },
                },
                new Catalog {
                    Title = "Педали",
                },
                new Catalog {
                    Title = "Велосипеды",
                    ChildCatalogs = new List<Catalog> {
                        new Catalog
                        {
                            Title = "Горные велосипеды",
                        },
                        new Catalog
                        {
                            Title = "Шоссейные велосипеды",
                        },
                        new Catalog
                        {
                            Title = "Гибридные велосипеды",
                        },
                         new Catalog
                        {
                            Title = "BMX велосипеды",
                        },
                    },
                },
            };

            catalogRepository.AddRange(catalogs);
            await catalogRepository.SaveChangesAsync();
        }

        public static async Task ProductGroupsAsync(IServiceProvider serviceProvider)
        {
            var productGroupRepository = serviceProvider.GetRequiredService<IProductGroupRepository>();
            productGroupRepository.AddRange(Enumerable.Range(1, 26).Select(n => new ProductGroup("Product Group " + n)));
            await productGroupRepository.SaveChangesAsync();
        }

        public static async Task ProductsAsync(IServiceProvider serviceProvider)
        {
            var productService = serviceProvider.GetRequiredService<ProductService>();
            var mapper = serviceProvider.GetRequiredService<IMapper>();

            var products = new List<Product>();

            for (int i = 1; i < 50; i++)
            {
                products.Add(new Product
                {
                    Title = $"Product title {i}",
                    Content = $"Product content {i}",
                    Price = 11.3M + (i * 3.423M)
                });
            }

            foreach (var product in products)
            {
                await productService.CreateProductAsync(mapper.Map<ProductDto>(product), null, null);
            }
        }

        //public static async Task OrdersAsync(IServiceProvider serviceProvider)
        //{
        //    var userService = serviceProvider.GetRequiredService<UserService>();
        //    var productService = serviceProvider.GetRequiredService<ProductService>();
        //    var orderService = serviceProvider.GetRequiredService<OrderService>();

        //    var users = await userService.GetAllUsersAsync();

        //    var rand = new Random();

        //    for (int i = 1; i < 50; i++)
        //    {
        //        var userIndex = rand.Next(0, users.Count() - 1);

        //        await orderService.CreateOrderAsync(new Order
        //        {
        //            CustomerUserId = users.ElementAt(userIndex).Id,
        //            OrderDate = DateTime.Now,
        //            ShipAddress = $"Ship address {i}",
        //            ShipPostalCode = $"Ship postal code {i}",
        //            CustomerComment = $"Customer comment {i}"
        //        });
        //    }

        //    var products = await productService.GetAllProductsAsync();
        //    var orders = await orderService.GetAllOrdersAsync();

        //    for (int i = 1; i < 150; i++)
        //    {
        //        var orderIndex = rand.Next(0, orders.Count() - 1);
        //        var productIndex = rand.Next(0, products.Count() - 1);

        //        try
        //        {
        //            await orderService.CreateOrderProductAsync(new OrderProduct
        //            {
        //                OrderId = orders.ElementAt(orderIndex).Id,
        //                ProductId = products.ElementAt(productIndex).Id,
        //                Quantity = rand.Next(1, 5)
        //            });
        //        }
        //        catch { }
        //    }

        //}




    }
}
