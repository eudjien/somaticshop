using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class SetUserOrAnonymousInBasketToUnique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserOrAnonymousId",
                table: "Baskets",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Baskets_UserOrAnonymousId",
                table: "Baskets",
                column: "UserOrAnonymousId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Baskets_UserOrAnonymousId",
                table: "Baskets");

            migrationBuilder.AlterColumn<string>(
                name: "UserOrAnonymousId",
                table: "Baskets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
