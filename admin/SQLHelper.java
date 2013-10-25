import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;



public class SQLHelper {

	private static final String MEDIAFILE_TABLE_NAME = "mediaFile";
	private static final String MEDIAFILE_URL = "url";
	private static final String MEDIAFILE_BELONGS_TO = "belongsTo";
	private static final String MEDIAFILE_VIDEO = "video";
	private static final String MEDIAFILE_PUBLIC = "public";
	
	private String hostname, dbName, username, password;
	private int port;
	private Statement st;
	
	public SQLHelper(String hostname, int port, String dbName, String username, String password) {
		this.hostname = hostname;
		this.dbName = dbName;
		this.port = port;
		this.username = username;
		this.password = password;
	}
	
	public void connect() throws ClassNotFoundException, SQLException {
		//Register the JDBC driver for MySQL.
        Class.forName("com.mysql.jdbc.Driver");

        //Define URL of database server for
        String url = "jdbc:" + hostname + ":" + port + "/" + dbName;

        //Get a connection to the database for a
        java.sql.Connection con = DriverManager.getConnection(url, username, password);

        //Display URL and connection information
        System.out.println("URL: " + url);
        System.out.println("Connection: " + con);

        //Get a Statement object
        st = con.createStatement();
	}
	
	public void insertMediaFile(String url, boolean isVideo, boolean isPublic, int caseId) throws SQLException {
		String temp = "INSERT INTO " + MEDIAFILE_TABLE_NAME + " (" + MEDIAFILE_URL + ", " + MEDIAFILE_PUBLIC + ", "
				+ MEDIAFILE_VIDEO + ", " + MEDIAFILE_BELONGS_TO + ") values (\"" + url + "\", " + (isPublic ? 1 : 0) + ", " + (isVideo ? 1 : 0)
				+ ", " + caseId + ")";
		System.out.println(temp);
		st.executeUpdate(temp);
	}
	public int insertCase(String caseName, boolean isPublic, String pubdescription, String privdescription) throws SQLException {
		String temp = "INSERT INTO caseT (name, public, publicDescription, privateDescription) values "
				+ "(\"" + caseName + "\", " + (isPublic ? 1 : 0) + ", \"" + pubdescription + "\", \"" + privdescription + "\")";
		System.out.println(temp);
		return st.executeUpdate(temp, Statement.RETURN_GENERATED_KEYS);
		//return 5;
	}
	
	public int insertCategory(String catName) throws SQLException {
		String temp = "INSERT INTO category (name) values (\"" + catName + "\")";
		System.out.println(temp);
		st.executeUpdate(temp);
		return getCategoryID(catName);
		//st.executeUpdate(temp, Statement.RETURN_GENERATED_KEYS);
		
		
		//return 11;
	}
	
	public int getCategoryID(String name) throws SQLException {
		String temp = "SELECT id FROM category WHERE name=\""+name+"\"";
		System.out.println(temp);
		ResultSet rs = st.executeQuery(temp);
		int id = -1;
		while(rs.next()){
			id = rs.getInt("id");
			System.out.println(id);
		}
		return id;
		
		//
		//return -1;
		
	}
	
	public int getSubCategoryID(int superid, int subid) throws SQLException {
		//select id from subCategory where superCategory=4 and subCategory=11
		String temp = "SELECT id FROM subCategory WHERE superCategory="+superid+" and subCategory="+subid;
		System.out.println(temp);
		ResultSet rs = st.executeQuery(temp);
		int id = -1;
		while(rs.next()){
			id = rs.getInt("id");
		}
		return id;
		
		//System.out.println(temp);
		//return -1;
		
		
	}
	

	public void insertSubCategory(int superid, int subid) throws SQLException {
		String temp = "INSERT INTO subCategory (superCategory, subCategory) VALUES ("+superid+","+subid+")";
		System.out.println(temp);
		st.executeUpdate(temp);
		//INSERT INTO `USNeuroNav`.`subCategory` (`superCategory`, `subCategory`) VALUES ('13', '14');
		
	}

	public void insertBelongsTo(int caseID, int categoryid) throws SQLException {
		String temp = "INSERT INTO belongsTo (caseT, category) VALUES ("+caseID+","+categoryid+")";
		System.out.println(temp);
		st.executeUpdate(temp);
		
	}

	public void insertNewUser(String name, String password2) throws SQLException {
		String temp = "INSERT INTO user (username, password) VALUES (\""+name+"\",\""+password2+"\")";
		System.out.println(temp);
		st.executeUpdate(temp);
		
	}

}
