using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FuturisticPortfolio.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitorCountryAndDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Visitors",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimeSpentSeconds",
                table: "Visitors",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                table: "Visitors");

            migrationBuilder.DropColumn(
                name: "TimeSpentSeconds",
                table: "Visitors");
        }
    }
}
