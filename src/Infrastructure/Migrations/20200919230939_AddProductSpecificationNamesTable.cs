using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class AddProductSpecificationNamesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "ProductSpecifications");

            migrationBuilder.AddColumn<int>(
                name: "ProductSpecificationValueId",
                table: "ProductSpecifications",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProductSpecificationValues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecificationValues", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecifications_ProductSpecificationValueId",
                table: "ProductSpecifications",
                column: "ProductSpecificationValueId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecificationValues_Value",
                table: "ProductSpecificationValues",
                column: "Value",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSpecifications_ProductSpecificationValues_ProductSpecificationValueId",
                table: "ProductSpecifications",
                column: "ProductSpecificationValueId",
                principalTable: "ProductSpecificationValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductSpecifications_ProductSpecificationValues_ProductSpecificationValueId",
                table: "ProductSpecifications");

            migrationBuilder.DropTable(
                name: "ProductSpecificationValues");

            migrationBuilder.DropIndex(
                name: "IX_ProductSpecifications_ProductSpecificationValueId",
                table: "ProductSpecifications");

            migrationBuilder.DropColumn(
                name: "ProductSpecificationValueId",
                table: "ProductSpecifications");

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "ProductSpecifications",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
