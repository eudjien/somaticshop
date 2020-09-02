using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class FixUserOrAnonymousNameInBuyer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserOrAnonymoysId",
                table: "Buyers");

            migrationBuilder.AddColumn<string>(
                name: "UserOrAnonymousId",
                table: "Buyers",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserOrAnonymousId",
                table: "Buyers");

            migrationBuilder.AddColumn<string>(
                name: "UserOrAnonymoysId",
                table: "Buyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
