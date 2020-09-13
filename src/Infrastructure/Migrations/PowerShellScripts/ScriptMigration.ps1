$scriptName = Read-Host 'Output script filename (w/o *.sql)'
dotnet ef migrations script -i -c AppDbContext -s ..\..\..\Web -p ..\..\..\Infrastructure -o ./../Infrastructure/Migrations/$scriptName.sql
pause