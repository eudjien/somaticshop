using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class DeleteCatalogFilters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CatalogFilterItems");

            migrationBuilder.DropTable(
                name: "CatalogFilterGroup");

            migrationBuilder.DropTable(
                name: "CatalogFilters");

            migrationBuilder.DropTable(
                name: "CatalogFilterTypes");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CatalogFilterGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogFilterGroup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogFilters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogFilters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogFilters_Catalogs_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Catalogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CatalogFilterTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogFilterTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogFilterItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CatalogFilterGroupId = table.Column<int>(type: "int", nullable: false),
                    CatalogFilterId = table.Column<int>(type: "int", nullable: false),
                    CatalogFilterTypeId = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogFilterItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogFilterItems_CatalogFilterGroup_CatalogFilterGroupId",
                        column: x => x.CatalogFilterGroupId,
                        principalTable: "CatalogFilterGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CatalogFilterItems_CatalogFilters_CatalogFilterId",
                        column: x => x.CatalogFilterId,
                        principalTable: "CatalogFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CatalogFilterItems_CatalogFilterTypes_CatalogFilterTypeId",
                        column: x => x.CatalogFilterTypeId,
                        principalTable: "CatalogFilterTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "CatalogFilterTypes",
                columns: new[] { "Id", "Title" },
                values: new object[] { 1, "CheckboxList" });

            migrationBuilder.InsertData(
                table: "CatalogFilterTypes",
                columns: new[] { "Id", "Title" },
                values: new object[] { 2, "RadioList" });

            migrationBuilder.InsertData(
                table: "CatalogFilterTypes",
                columns: new[] { "Id", "Title" },
                values: new object[] { 3, "RangeValue" });

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilterItems_CatalogFilterGroupId",
                table: "CatalogFilterItems",
                column: "CatalogFilterGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilterItems_CatalogFilterId",
                table: "CatalogFilterItems",
                column: "CatalogFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilterItems_CatalogFilterTypeId",
                table: "CatalogFilterItems",
                column: "CatalogFilterTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilterItems_Value",
                table: "CatalogFilterItems",
                column: "Value",
                unique: true,
                filter: "[Value] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilters_CategoryId",
                table: "CatalogFilters",
                column: "CategoryId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CatalogFilterTypes_Title",
                table: "CatalogFilterTypes",
                column: "Title",
                unique: true);
        }
    }
}
