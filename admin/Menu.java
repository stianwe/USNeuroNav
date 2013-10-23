import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.ArrayList;


public class Menu {

	private static BufferedReader br;
	String input;
	String temp;
	SQLHelper sql = new SQLHelper("mysql://localhost", 3306, "USNeuroNav", "root", "");
	MediaUploader muSQL = new MediaUploader();
	
	public Menu(){
		input = "";
		br = new BufferedReader(new InputStreamReader(System.in));
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
				
				break;
			case 3:
				
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

	private void createNewCase() throws SQLException {
		ArrayList<String> catList = new ArrayList<String>();
		boolean moreCats = true;
		boolean publicCase;
		String description;
		String caseName;
		String path;
		int caseID;
		pl("");
		pl("Creating a new case:");
		pl("");
		
		caseName = getCaseName();
		
		catList = getCaseCategories(caseName);
			
		description = getCaseDescription(catList);
			
		path = getPath();
		
		publicCase = isPublic();
	
			
		//Database start:
		//Adding new case
		caseID = sql.insertCase(caseName, publicCase, description);
		
		//uploading mediafiles
		String[] medFiles = { ""+caseID, path, (publicCase ? "public" : "private")};
		muSQL.uploadMedia(medFiles);
		
		//updating categories...
		for (int i = 0; i < catList.size(); i++) {
			int id = sql.getCatID(catList.get(i));
			if(id==-1){
				//create new category
				//add new category in belongsTo
			} else {
				//add to belongsTo
			}
		}
		


		
		//System.out.println("Usage: upload <case ID> <dir> <visibility (public/private)>");
			
			
		
	}

	private void printMainMenu(){
		pl("Mainmenu");
		pl("1: Create new case");
		pl("2: Create new category");
		pl("3: Create new user");
		pl("4: Exit program");
		pl("Select your choice:");
	}
	
	private void yesNo(){
		pl("1: Yes");
		pl("2: No");	
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
	
	private ArrayList<String> getCaseCategories(String name){
		ArrayList<String> outList = new ArrayList<String>();
		boolean correct = false;
		pl("Enter the categories that this case belongs to");
		pl("Start with the top category, separate categories with a comma (,)");
		
		while(!correct){
			
			temp = getInput();
			
			String[] myInput = temp.split(",");
			for(String s : myInput){
				outList.add(s);
			}
			
		
			pl(name+" belongs to the following categories:");
			String tabs = "";
			for(int i = 0; i < outList.size();i++){
				pl(tabs+outList.get(i));
				tabs = tabs + "   ";		
			}
			pl("");
			pl("1: This is correct");
			pl("2: I want to add more categories");
			pl("3: I want to restart this step");
			
			int choice = Integer.parseInt(getInput());
			
			switch(choice){

			case 1:
				correct = true;
				break;
			case 2:
				pl("");
				pl("Add more categories to the current list");
				pl("If the hierarchy is wrong you should restart");
				pl("Enter additional categories:");
				break;
			case 3:
				pl("");
				pl("");
				pl("Enter the categories that this case belongs to");
				pl("Start with the top category, separate categories with a comma (,)");
				outList.clear();
				break;
			default:
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
			pl("Enter a description for the case:");
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
