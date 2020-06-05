using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Infrastructure.Migrations
{
    public partial class IntialSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new [] 
                {
                    "Id","Name" , "NormalizedName","ConcurrencyStamp","Active","EntryDate","IsAdmin","IsMember"
                },
                values: new object[] { Guid.NewGuid(),"Administrator", "Administrator", Guid.NewGuid().ToString(),true, DateTime.Now,true,false });
            migrationBuilder.InsertData(
               table: "AspNetRoles",
               columns: new[]
               {
                    "Id","Name" , "NormalizedName","ConcurrencyStamp","Active","EntryDate","IsAdmin","IsMember"
               },
               values: new object[] { Guid.NewGuid(),"GeneralMember", "General Member", Guid.NewGuid().ToString(), true, DateTime.Now, false, true });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
