import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;


public class Menu {

	private static BufferedReader br;
	String input;
	String temp;
	SQLHelper sql = new SQLHelper("mysql://localhost", 3306, "USNeuroNav", "root", "");
	MediaUploader muSQL = new MediaUploader();
	
	public Menu() throws ClassNotFoundException, SQLException{
		input = "";
		br = new BufferedReader(new InputStreamReader(System.in));
		sql.connect();
		
	}
	
	void run() throws SQLException {
		while(true){
			printMainMenu();
			
			temp = getInput();
			
			if (temp.equals(null)||temp.equals(""));
				input="4";
			int choice = Integer.parseInt(temp);
			
			switch(choice){
			case 1:
				createNewCase();
				break;
			case 2:
				createNewCategory();
				break;
			case 3:
				createNewUser();	
				break;
			case 4:
				pl("Exiting Program...");
				System.exit(0);
				break;
			default:
				pl("No valid choices selected, type a 1,2,3 or 4");
			}
			
			
		}
	}

	private void createNewCategory() throws SQLException {
		ArrayList<String> subCats = new ArrayList<String>();
		ArrayList<String> superCats = new ArrayList<String>();
		String name;
		int id;
		name = enterCategoryName();
		
		id = createCategory(name);
		pl("");
		superCats = getListOfCats("Enter the parent (super-) categories of the case "+name,name,true);
		pl("");
		subCats = getListOfCats("Enter the child (sub-) categories of the case "+name,name,false);
		pl("");
		updateCatsBatch(name, id,superCats,subCats);
		
		
		pl("\nNew Category added");
		pl("Returning to mainmenu \n");
		
		
		
	}

	private void updateCatsBatch(String name, int id,
		ArrayList<String> superCats, ArrayList<String> subCats) throws SQLException {
		// TODO Auto-generated method stub
		if(superCats.isEmpty())
			superCats.add("root");
		for(String s : superCats){
			if(!s.equals("")){
				int superid = createCategory(s);
				boolean existed = addToSubCats(superid, id);
				if(existed){
					pl("The relationship between "+s+" and "+name+" already existed in the database");
				} else {
					pl("The relationship between "+s+" and "+name+" has been added to the database");
				}
			}
		}
		for(String s : subCats){
			if(!s.equals("")){
				int subid = createCategory(s);
				boolean existed = addToSubCats(id, subid);
				if(existed){
					pl("The relationship between "+s+" and "+name+" already existed in the database");
				} else {
					pl("The relationship between "+s+" and "+name+" has been added to the database");
				}
			}
		}
		
	}

	private void createNewUser() throws SQLException {
		String name = getUserName();
		if(checkName(name)){
			String password = getPassword(name);
			sql.insertNewUser(name, password);
			pl("User "+name+" has been added to the database");
		} else
			pl("This username already exists in the database");
		
		
	}
	
	private boolean checkName(String name) throws SQLException{
		int check = sql.getUser(name);
		if(check!=-1){
			pl("This username already exists in the database");
			return false;
		} 
		return true;
	}
	
	private void listAllCats() throws SQLException{
		ResultSet rs = sql.getAllCats();
		pl("Categories in the database:");
		while(rs.next()){
			pl(rs.getString("name"));
		}
	}

	private String getUserName() {
		boolean correct = false;
		String temp ="";
		while (!correct){
			pl("Insert the username for the new user:");
			temp = getInput();
			
			
			pl("Username: "+temp);
			pl("");
			correct = confirmation();
		}
		return temp;

	}
	
	private String getPassword(String user) {
		boolean correct = false;
		String temp ="";
		while (!correct){
			pl("Insert the password for user for the user: "+user);
			temp = getInput();
			
			
			pl("The password is: "+temp);
			pl("");
			correct = confirmation();
		}
		return temp;

	}
	
	private String enterCategoryName() {
		boolean correct = false;
		String temp ="";
		while (!correct){
			pl("Insert the name of the category:");
			temp = getInput();
			
			
			pl("The category name is: "+temp);
			pl("");
			correct = confirmation();
		}
		return temp;

	}

	private int createCategory(String name) throws SQLException {
		int number;
		number = sql.getCategoryID(name);
		if(number==-1){
			number = sql.insertCategory(name);
			pl("Creating new category: "+name);
		}
		return number;
		
	}
	


	private ArrayList<String> getListOfCats(String text, String caseName, boolean isSuper) throws SQLException { //fix shit
		ArrayList<String> outList = new ArrayList<String>();
		boolean correct = false;
		pl(text);
		
		while(!correct){
			
			temp = getInput();
			
			String[] myInput = temp.split(",");
			for(String s : myInput){
				outList.add(s);
			}
			
		
			pl(caseName+" belongs to the following categories:");
			String tabs = "";
			for(int i = 0; i < outList.size();i++){
				if(outList.get(i).equals(""))
					if(isSuper){
						outList.add("root");
						pl("root");
					} else {
						pl("no subcategories entered");
					}
				else
					pl(outList.get(i));		
			}

			
			boolean goOn = false;
			
			while(!goOn){
				pl("");
				pl("1: This is correct");
				pl("2: I want to add more categories");
				pl("3: I want to restart this step");
				pl("4: List all categories in the database");
				
				int choice = Integer.parseInt(getInput());
				
				switch(choice){
	
				case 1:
					correct = true;
					goOn = true;
					break;
				case 2:
					pl("");
					pl("Add more categories to the current list");
					pl("If the hierarchy is wrong you should restart");
					pl("Enter additional categories:");
					goOn = true;
					break;
				case 3:
					pl("");
					pl("");
					pl("Enter the categories that this case belongs to");
					pl("Start with the top category, separate categories with a comma (,)");
					outList.clear();
					goOn = true;
					break;
				case 4:
					listAllCats();
					goOn = false;
					break;
				default:
					goOn = false;
				}
			}
			
			
		}
		return outList;

		
	}

	private void createNewCase() throws SQLException {
		ArrayList<String> catList = new ArrayList<String>();
		boolean moreCats = true;
		boolean publicCase;
		String pubdescription;
		String privdescription;
		String caseName;
		String path;
		int caseID;
		pl("");
		pl("Creating a new case:");
		pl("");
		
		caseName = getCaseName();
		
		catList = getCaseCategories(caseName);
			
		pubdescription = getCaseDescription(catList);
		privdescription = getCasePrivDescription();
			
		path = getPath();
		
		publicCase = isPublic();
	
			
		//Database start:
		//Adding new case
		caseID = sql.insertCase(caseName, publicCase, pubdescription, privdescription);
		
		//uploading mediafiles
		String[] medFiles = { ""+caseID, path, (publicCase ? "public" : "private")};
		pl("Mediafiles string:");
		for(String s : medFiles){
			pl(s);
		}
		//muSQL.uploadMedia(medFiles);
		
		//updating categories...
		updateCats(catList,caseID);
		
		

		


		
		//System.out.println("Usage: upload <case ID> <dir> <visibility (public/private)>");
			
			
		
	}

	private String getCasePrivDescription() {
			boolean correct = false;
			String temp ="";
			while (!correct){
				pl("Enter the private description for the case:");
				pl("This will only be visible for registered users");
				pl("You can use \\n to insert linebreaks");
				temp = getInput();
				
				
				pl("Case private description:");
				pl(temp);
				pl("");
				correct = confirmation();
			}
			return temp;
	}

	private void printMainMenu(){
		pl("Mainmenu");
		pl("1: Create new case");
		pl("2: Create new category");
		pl("3: Create new user");
		pl("4: Exit program");
		pl("Select your choice:");
	}
	
	
	private void updateCats(ArrayList<String> catList, int caseID) throws SQLException{
		ArrayList<Integer> idList = new ArrayList<Integer>();
		
		for (int i = 0; i < catList.size(); i++) {
			idList.add(sql.getCategoryID(catList.get(i)));
			if(idList.get(i)==-1){ //if category doesnt exist
				//create new category
				pl("Category: " + catList.get(i)+" does not currently exist.");
				pl("Creating new category: "+catList.get(i));
				idList.remove(i);
				idList.add(sql.insertCategory(catList.get(i)));
				//add new category in belongsTo

				int superID = (i==0 ? (sql.getCategoryID("root")) : (int) idList.get(i-1));
				sql.insertSubCategory(superID,(int) idList.get(i));
				
				
			} else { //if category already exists:
				int superID = (i==0 ? (sql.getCategoryID("root")) : (int) idList.get(i-1));
				boolean existed = addToSubCats(superID,(int) idList.get(i));
				if(!existed){
					pl("Relationship beetween super-category: "+(i==0 ? "root" : catList.get(i-1))+" and subcategory: "+catList.get(i)+
							" did not exist, it has now been created in the database");
					
				}
			}
			//add to belongsTo
			sql.insertBelongsTo(caseID, (int) idList.get(i));		
		}//end of for
	}
	
	private void yesNo(){
		pl("1: Yes");
		pl("2: No");	
	}
	
	private boolean addToSubCats(int superid, int subid) throws SQLException{
		boolean existed = true;
		int check1 = sql.getSubCategoryID(superid, subid);
		int check2 = sql.getSubCategoryID(subid, superid);
		if(check1==-1 && check2==-1){
			existed = false;
			sql.insertSubCategory(superid, subid);
		}
		return existed;
		
	}
	
	
	private boolean isPublic(){
		pl("Is this case public or private?");
		pl("1: Public");
		pl("2: Private");
		
		if(Integer.parseInt(getInput())==2)
			return false;
		return true;
	}
	
	private String getPath(){
		boolean correct = false;
		String output = "";
		while(!correct){
			pl("Enter the path where the case-mediafiles are stored:");
			pl("Use this format: C:\\User\\Media\\Cases\\Thiscase\\SnapshotsOK");
			
			
			output = getInput();
			
			pl("You entered: "+output);
			correct = confirmation();		
		}
		return output;
	}
	
	private ArrayList<String> getCaseCategories(String name) throws SQLException{
		ArrayList<String> outList = new ArrayList<String>();
		boolean correct = false;
		pl("Enter the categories that this case belongs to");
		pl("Start with the top category, separate categories with a comma (,)");
		
		while(!correct){
			
			temp = getInput();
			
			String[] myInput = temp.split(",");
			for(String s : myInput){
				outList.add(s.trim());
			}
			
		
			pl(name+" belongs to the following categories:");
			String tabs = "";
			for(int i = 0; i < outList.size();i++){
				pl(tabs+outList.get(i));
				tabs = tabs + "   ";		
			}
			boolean goOn = false;
			
			while(!goOn){
				pl("");
				pl("1: This is correct");
				pl("2: I want to add more categories");
				pl("3: I want to restart this step");
				pl("4: List all categories in the database");
				
				int choice = Integer.parseInt(getInput());
				
				switch(choice){
	
				case 1:
					correct = true;
					goOn = true;
					break;
				case 2:
					pl("");
					pl("Add more categories to the current list");
					pl("If the hierarchy is wrong you should restart");
					pl("Enter additional categories:");
					goOn = true;
					break;
				case 3:
					pl("");
					pl("");
					pl("Enter the categories that this case belongs to");
					pl("Start with the top category, separate categories with a comma (,)");
					outList.clear();
					goOn = true;
					break;
				case 4:
					listAllCats();
					goOn = false;
					break;
				default:
					goOn = false;
				}
			}
			
			
		}
		return outList;
	}
	
	private String getCaseName(){
		boolean correct = false;
		String output = "";
		while(!correct){
			pl("Enter the name of the new case:");
			
			output = getInput();
			
			pl("");
			pl("Case: "+output);
			correct = confirmation();
		}
		return output;
	}
	
	private String getCaseDescription(ArrayList<String> cats){
		boolean correct = false;
		String temp ="";
		while (!correct){
			pl("Enter the public description for the case:");
			pl("You can use \\n to insert linebreaks");
			pl("If you enter \"default\" then a default description will be created for you");
			temp = getInput();
			
			if(temp.equals("default") && cats.size()>0 && cats!=null){
				temp = "";
				for (int i = 0; i < cats.size() ; i++){
					if(i==cats.size()-1)
						temp = temp +(cats.get(i));
					else
						temp = temp + (cats.get(i) + ", ");
				}
				
				

			}
			
			pl("Case description:");
			pl(temp);
			pl("");
			correct = confirmation();
		}
		return temp;
	}
	
	private String getInput(){
		try {	
			input = br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return input;
	}
	
	private boolean confirmation(String s){
		pl(s);
		yesNo();
		if(Integer.parseInt(getInput())==2)
			return false;	
		return true;
	}
	
	private boolean confirmation(){
		return confirmation("Is this correct?");
	}


	private void pl(String string) {
		System.out.println(string);	
	}	
}
