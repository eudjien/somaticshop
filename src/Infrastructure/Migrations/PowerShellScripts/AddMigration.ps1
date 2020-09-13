$migrationName = Read-Host 'New migration name' 
dotnet ef migrations add $migrationName -c AppDbContext -s ..\..\..\Web -p ..\..\..\Infrastructure -o .\..\Infrastructure\Migrations --verbose
pause
