import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.StringBufferInputStream;
import java.io.StringReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class Main {

	
	public static void main(String[] args){
		Menu menu = null;
		if (args.length > 1) {
			System.out.println("Invalid arguments");
		} else if (args.length == 0) {
			try {
				menu = new Menu();
				menu.run();
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			File file = new File(args[0]);
			if (!file.isFile()) {
				System.out.println("The given argument is not a file!");
				return;
			}
			BufferedReader reader = null;
			try {
				reader = new BufferedReader(new FileReader(file));
				String temp;
				List<String> strings = new ArrayList<String>();
				while ((temp = reader.readLine()) != null) {
					if (temp.startsWith("#")) {
						continue;
					}
					strings.add(temp);
				}
				if (strings.size() != 6) {
					System.out.println("Invalid input format!");
					return;
				}
				try {
					String s = "1\n" + strings.get(0) + "\n1\n" + strings.get(1) + "\n1\n" + strings.get(2) + 
							"\n1\n" + strings.get(3) + "\n1\n" + strings.get(4) + "\n1\n" + 
							(strings.get(5).equalsIgnoreCase("private") ? 2 : 1) + "\n4\n";
					//menu = new Menu();
					StringReader sr = new StringReader(s);
					BufferedReader br = new BufferedReader(sr);
					menu = new Menu(br);
					menu.run();
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} catch (FileNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} finally {
				try {
					reader.close();
				} catch (Exception e) {}
			}
		}
	}
	
	
}
