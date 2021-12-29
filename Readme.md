# Covid19 Alert
The project development is based on safety critical measures to track corona virus infected people within a specific area and alert users to keep a safe distance. Using this system, a user can get accurate results of the healthy status of persons that he/she got in contact with at different times and certain distances since the system monitors users.

The project has two parts. One part is for admin and another part is for general users.
* USER PART:
	* Registration: User should fill up his First name, Last name, Phone Number, Id Number/Passport Number, Email Address, Password for registration.
	* Login: Users can login by giving Email and Password.
	* Consent: User should give consent for taking user’s current location data.
	* Tracking: When user logged in, the system will track user data by taking their latitude and longitude after every 5 min. System will get latitude and longitude by using GPS.
	* Alert Function: The application will calculate the data from latitude and longitude, and will give users an alert based on distance calculation to nearby users.
* ADMIN PANEL:
	* Mark / unmark: Admin can mark a user as COVID-19 positive or negative based on the medical report of a registered user. 
	* Search: Admin can search a user by Name, Email or ID.

### TECHNICAL REQUIREMENT
* Backend Technologies: C#, ASP .NET Core 3.
* Frontend Technologies: JavaScript (Vue.js), Bootstrap 4, Datatable, Node 
* Db Technologies: Microsoft SQL Server

##### Creating Database:
In **Visual Studio**==>

	Goto Package Manager Console==>(Command)
	Update-Database

For running **Front End**==>
In **Command Prompt**==>

	Goto \Src\Web Folder==>(Command)
	Node install
	Npm run webpack

	
