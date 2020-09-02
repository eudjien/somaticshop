using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Web.Migrations
{
    public partial class UpdateOrderAndBasketScheme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderedProducts");

            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "Orders");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Date",
                table: "Orders",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "BasketProducts",
                type: "Decimal",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "BasketProducts");

            migrationBuilder.AddColumn<DateTime>(
                name: "OrderDate",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "OrderedProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrandId = table.Column<int>(type: "int", nullable: false),
                    CatalogId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageFileId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ImageId = table.Column<int>(type: "int", nullable: true),
                    ImageProductId = table.Column<int>(type: "int", nullable: true),
                    Price = table.Column<decimal>(type: "Decimal", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderedProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderedProducts_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderedProducts_Catalogs_CatalogId",
                        column: x => x.CatalogId,
                        principalTable: "Catalogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderedProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderedProducts_ProductImages_ImageProductId_ImageFileId",
                        columns: x => new { x.ImageProductId, x.ImageFileId },
                        principalTable: "ProductImages",
                        principalColumns: new[] { "ProductId", "FileId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderedProducts_BrandId",
                table: "OrderedProducts",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderedProducts_CatalogId",
                table: "OrderedProducts",
                column: "CatalogId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderedProducts_ProductId",
                table: "OrderedProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderedProducts_Title",
                table: "OrderedProducts",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_OrderedProducts_ImageProductId_ImageFileId",
                table: "OrderedProducts",
                columns: new[] { "ImageProductId", "ImageFileId" });
        }
    }
}
