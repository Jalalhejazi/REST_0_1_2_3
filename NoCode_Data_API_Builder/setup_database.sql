Use master
Go


IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'StudentDB')
BEGIN
	ALTER DATABASE [StudentDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
	DROP DATABASE [StudentDB]
END

CREATE DATABASE [StudentDB]
Go

Use StudentDB
GO



SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentDetails](
	[Id] [int] Identity(1,1) primary key Not NULL,
	[Name] [nvarchar](100) NULL,
	[Email] [nvarchar](100) NULL,
	[Password] [nvarchar](max) NULL,
	[DateofBirth] [date] NULL,
	[DateofJoining] [date] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
INSERT [dbo].[StudentDetails] ([Name], [Email], [Password], [DateofBirth], [DateofJoining]) VALUES (N'User 01', N'user01@mail.com', N'user111', CAST(N'2010-10-10' AS Date), CAST(N'2022-08-01' AS Date))
GO
INSERT [dbo].[StudentDetails] ([Name], [Email], [Password], [DateofBirth], [DateofJoining]) VALUES (N'User 02', N'user01@mail.com', N'user222', CAST(N'2020-01-01' AS Date), CAST(N'2010-05-10' AS Date))
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetStudentDetails]
(
	@Id INT = NULL, @Name NVARCHAR(100) = NULL, @Email NVARCHAR(100) = NULL, 
	@Password NVARCHAR(MAX) = NULL, @DateofBirth DATE = NULL, @DateofJoining DATE = NULL,
	@Action NVARCHAR(20)
)
AS
BEGIN
	IF @Action = 'StudentDetails'
	BEGIN
		SELECT * FROM StudentDetails
	END

	IF @Action = 'StudentData'
	BEGIN
		SELECT * FROM StudentDetails WHERE id = @Id
	END

	IF @Action = 'AddStudent'
	BEGIN
		INSERT INTO StudentDetails VALUES (@Name, @Email, @Password, @DateofBirth, @DateofJoining)
	END

	IF @Action = 'UpdateStudent'
	BEGIN
		UPDATE StudentDetails SET Name = @Name, Email = @Email, Password = @Password, DateofBirth = @DateofBirth, 
		DateofJoining = @DateofJoining WHERE Id = @Id
	END

	IF @Action = 'DeleteStudent'
	BEGIN
		DELETE FROM StudentDetails WHERE id = @Id
	END
END
GO
