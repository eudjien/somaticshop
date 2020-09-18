using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class AddProductGroupSpecificationAndRenameSpecificationTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductSpecs");

            migrationBuilder.DropTable(
                name: "ProductSpecNames");

            migrationBuilder.CreateTable(
                name: "ProductSpecificationNames",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecificationNames", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductGroupSpecifications",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: true),
                    ProductGroupId = table.Column<int>(nullable: false),
                    ProductSpecificationNameId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGroupSpecifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductGroupSpecifications_ProductGroups_ProductGroupId",
                        column: x => x.ProductGroupId,
                        principalTable: "ProductGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductGroupSpecifications_ProductSpecificationNames_ProductSpecificationNameId",
                        column: x => x.ProductSpecificationNameId,
                        principalTable: "ProductSpecificationNames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductSpecifications",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: true),
                    ProductId = table.Column<int>(nullable: false),
                    ProductSpecificationNameId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductSpecifications_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductSpecifications_ProductSpecificationNames_ProductSpecificationNameId",
                        column: x => x.ProductSpecificationNameId,
                        principalTable: "ProductSpecificationNames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroupSpecifications_ProductGroupId",
                table: "ProductGroupSpecifications",
                column: "ProductGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroupSpecifications_ProductSpecificationNameId",
                table: "ProductGroupSpecifications",
                column: "ProductSpecificationNameId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecificationNames_Name",
                table: "ProductSpecificationNames",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecifications_ProductId",
                table: "ProductSpecifications",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecifications_ProductSpecificationNameId",
                table: "ProductSpecifications",
                column: "ProductSpecificationNameId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductGroupSpecifications");

            migrationBuilder.DropTable(
                name: "ProductSpecifications");

            migrationBuilder.DropTable(
                name: "ProductSpecificationNames");

            migrationBuilder.CreateTable(
                name: "ProductSpecNames",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecNames", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductSpecs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductSpecNameId = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductSpecs_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductSpecs_ProductSpecNames_ProductSpecNameId",
                        column: x => x.ProductSpecNameId,
                        principalTable: "ProductSpecNames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecNames_Name",
                table: "ProductSpecNames",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecs_ProductId",
                table: "ProductSpecs",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecs_ProductSpecNameId",
                table: "ProductSpecs",
                column: "ProductSpecNameId");
        }
    }
}
