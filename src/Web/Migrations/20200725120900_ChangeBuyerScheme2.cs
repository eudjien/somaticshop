using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class ChangeBuyerScheme2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Buyers_Baskets_BasketId",
                table: "Buyers");

            migrationBuilder.DropIndex(
                name: "IX_Buyers_BasketId",
                table: "Buyers");

            migrationBuilder.DropColumn(
                name: "BasketId",
                table: "Buyers");

            migrationBuilder.DropColumn(
                name: "BuyerId",
                table: "Baskets");

            migrationBuilder.AlterColumn<string>(
                name: "UserOrAnonymoysId",
                table: "Buyers",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserOrAnonymousId",
                table: "Baskets",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserOrAnonymousId",
                table: "Baskets");

            migrationBuilder.AlterColumn<string>(
                name: "UserOrAnonymoysId",
                table: "Buyers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<int>(
                name: "BasketId",
                table: "Buyers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BuyerId",
                table: "Baskets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Buyers_BasketId",
                table: "Buyers",
                column: "BasketId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Buyers_Baskets_BasketId",
                table: "Buyers",
                column: "BasketId",
                principalTable: "Baskets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
