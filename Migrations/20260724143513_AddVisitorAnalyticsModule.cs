using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FuturisticPortfolio.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitorAnalyticsModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnalyticsSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnableTracking = table.Column<bool>(type: "bit", nullable: false),
                    EnableGeoLookup = table.Column<bool>(type: "bit", nullable: false),
                    EnableEventTracking = table.Column<bool>(type: "bit", nullable: false),
                    EnableHeatmaps = table.Column<bool>(type: "bit", nullable: false),
                    IgnoreAdminUsers = table.Column<bool>(type: "bit", nullable: false),
                    IgnoreLocalhost = table.Column<bool>(type: "bit", nullable: false),
                    IgnoreBots = table.Column<bool>(type: "bit", nullable: false),
                    QueueBatchSize = table.Column<int>(type: "int", nullable: false),
                    FlushIntervalSeconds = table.Column<int>(type: "int", nullable: false),
                    GoogleAnalyticsId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MicrosoftClarityId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RetentionDays = table.Column<int>(type: "int", nullable: false),
                    RetentionAction = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ArchiveFolderPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyticsSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DailyAnalytics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TargetDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UniqueVisitorsCount = table.Column<int>(type: "int", nullable: false),
                    TotalPageViews = table.Column<int>(type: "int", nullable: false),
                    TotalEvents = table.Column<int>(type: "int", nullable: false),
                    AvgSessionDurationSeconds = table.Column<int>(type: "int", nullable: false),
                    BounceRate = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HourlyAnalytics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TargetHour = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UniqueVisitorsCount = table.Column<int>(type: "int", nullable: false),
                    TotalPageViews = table.Column<int>(type: "int", nullable: false),
                    TotalEvents = table.Column<int>(type: "int", nullable: false),
                    AvgSessionDurationSeconds = table.Column<int>(type: "int", nullable: false),
                    BounceRate = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HourlyAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MonthlyAnalytics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    UniqueVisitorsCount = table.Column<int>(type: "int", nullable: false),
                    TotalPageViews = table.Column<int>(type: "int", nullable: false),
                    TotalEvents = table.Column<int>(type: "int", nullable: false),
                    AvgSessionDurationSeconds = table.Column<int>(type: "int", nullable: false),
                    BounceRate = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthlyAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VisitorTracks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitorCookieId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Region = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Latitude = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Longitude = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TimeZone = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DeviceType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    OperatingSystem = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OSVersion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BrowserFamily = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    BrowserVersion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Engine = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EngineVersion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Language = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ScreenResolution = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FirstVisitDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorTracks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeeklyAnalytics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WeekStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UniqueVisitorsCount = table.Column<int>(type: "int", nullable: false),
                    TotalPageViews = table.Column<int>(type: "int", nullable: false),
                    TotalEvents = table.Column<int>(type: "int", nullable: false),
                    AvgSessionDurationSeconds = table.Column<int>(type: "int", nullable: false),
                    BounceRate = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VisitorSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitorTrackId = table.Column<int>(type: "int", nullable: false),
                    SessionCookieId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastActivityAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VisitDurationSeconds = table.Column<int>(type: "int", nullable: false),
                    PagesVisitedCount = table.Column<int>(type: "int", nullable: false),
                    EventsTriggeredCount = table.Column<int>(type: "int", nullable: false),
                    IsBounce = table.Column<bool>(type: "bit", nullable: false),
                    ReferrerUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ReferralDomain = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    IsDirectVisit = table.Column<bool>(type: "bit", nullable: false),
                    SearchEngine = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    SocialMediaPlatform = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    UtmSource = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    UtmMedium = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    UtmCampaign = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    UtmContent = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    UtmTerm = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VisitorSessions_VisitorTracks_VisitorTrackId",
                        column: x => x.VisitorTrackId,
                        principalTable: "VisitorTracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PageVisits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitorSessionId = table.Column<int>(type: "int", nullable: false),
                    PagePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PageTitle = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    QueryString = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    StatusCode = table.Column<int>(type: "int", nullable: false),
                    EntryTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DurationSeconds = table.Column<int>(type: "int", nullable: false),
                    LoadTimeMilliseconds = table.Column<int>(type: "int", nullable: false),
                    ViewportWidth = table.Column<int>(type: "int", nullable: false),
                    ViewportHeight = table.Column<int>(type: "int", nullable: false),
                    IsEntryPage = table.Column<bool>(type: "bit", nullable: false),
                    IsExitPage = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageVisits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PageVisits_VisitorSessions_VisitorSessionId",
                        column: x => x.VisitorSessionId,
                        principalTable: "VisitorSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VisitorEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitorSessionId = table.Column<int>(type: "int", nullable: false),
                    EventName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    EventCategory = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PagePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TargetElementId = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    TargetText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TargetUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Value = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    MetadataJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VisitorEvents_VisitorSessions_VisitorSessionId",
                        column: x => x.VisitorSessionId,
                        principalTable: "VisitorSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyAnalytics_TargetDate",
                table: "DailyAnalytics",
                column: "TargetDate",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HourlyAnalytics_TargetHour",
                table: "HourlyAnalytics",
                column: "TargetHour",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyAnalytics_Year_Month",
                table: "MonthlyAnalytics",
                columns: new[] { "Year", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageVisits_EntryTime",
                table: "PageVisits",
                column: "EntryTime");

            migrationBuilder.CreateIndex(
                name: "IX_PageVisits_PagePath",
                table: "PageVisits",
                column: "PagePath");

            migrationBuilder.CreateIndex(
                name: "IX_PageVisits_VisitorSessionId",
                table: "PageVisits",
                column: "VisitorSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorEvents_EventName",
                table: "VisitorEvents",
                column: "EventName");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorEvents_Timestamp",
                table: "VisitorEvents",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorEvents_VisitorSessionId",
                table: "VisitorEvents",
                column: "VisitorSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorSessions_SessionCookieId",
                table: "VisitorSessions",
                column: "SessionCookieId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VisitorSessions_StartedAt",
                table: "VisitorSessions",
                column: "StartedAt");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorSessions_VisitorTrackId",
                table: "VisitorSessions",
                column: "VisitorTrackId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorTracks_IpAddress",
                table: "VisitorTracks",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_VisitorTracks_VisitorCookieId",
                table: "VisitorTracks",
                column: "VisitorCookieId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyAnalytics_WeekStartDate",
                table: "WeeklyAnalytics",
                column: "WeekStartDate",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalyticsSettings");

            migrationBuilder.DropTable(
                name: "DailyAnalytics");

            migrationBuilder.DropTable(
                name: "HourlyAnalytics");

            migrationBuilder.DropTable(
                name: "MonthlyAnalytics");

            migrationBuilder.DropTable(
                name: "PageVisits");

            migrationBuilder.DropTable(
                name: "VisitorEvents");

            migrationBuilder.DropTable(
                name: "WeeklyAnalytics");

            migrationBuilder.DropTable(
                name: "VisitorSessions");

            migrationBuilder.DropTable(
                name: "VisitorTracks");
        }
    }
}
