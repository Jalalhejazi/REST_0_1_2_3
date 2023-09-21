# Data Api Builder (Microsoft Open Source innovation)

- Low Code using a Generator | Less code | More time on Data    

- The source code is on GitHub: https://github.com/Azure/data-api-builder

- [Youtube | Quick API Endpoints Using Data API Builder](https://www.youtube.com/watch?v=XQRO_uoGhp4&t=218)

- https://learn.microsoft.com/en-us/azure/data-api-builder/overview-to-data-api-builder?tabs=azure-sql


![](https://learn.microsoft.com/en-us/azure/data-api-builder/media/data-api-builder-architecture-overview.png)




## POC | (Database model) SQLServer as Container

```bash
docker run -d --name sqlserverWithData -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password123" -p 1433:1433 jalalhejazi/microservice_sqlserver:latest

# Create the desired database model using sqlcmd automation 
sqlcmd -S localhost,1433 -U sa -P Password123 -i ./setup_database.sql
sqlcmd -S localhost,1433 -U sa -P Password123 -Q "SELECT count(*) as [TestCount]  FROM [StudentDB].[dbo].[StudentDetails]"
```

## Now REST API automatic generated using Microsoft Data API Builder 

```bash
# Change your connectionstring as needed --> dab init auto generate dab_config.json 
dab init --database-type mssql --connection-string "Data Source=localhost;Initial Catalog=StudentDB;User ID=sa;Password=Password123;Trust Server Certificate=True"

# add Database model (Tables, Views), and best practice is to use Stored Procedures for Security and Performance 
dab add studentDetails --source dbo.StudentDetails --permissions "anonymous:*"

# Done: Start Browsing REST API 
dab start

# Discovery REST API endpoint with swagger
# https://localhost:5001/swagger/index.html
# https://localhost:5001/api/studentDetails
# https://localhost:5001/graphql/

```

