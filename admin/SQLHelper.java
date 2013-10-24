import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;



public class SQLHelper {

	private static final String MEDIAFILE_TABLE_NAME = "mediaFile";
	private static final String MEDIAFILE_URL = "url";
	private static final String MEDIAFILE_BELONGS_TO = "belongsTo";
	private static final String MEDIAFILE_VIDEO = "video";
	private static final String MEDIAFILE_PUBLIC = "public";
	private static final String CASET_NAME = "name";
	private static final String CASET_PUBLIC = "public";
	private static final String CASET_DESCRIPTION = "description";
	
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
	public int insertCase(String caseName, boolean isPublic, String description) throws SQLException {
		String temp = "INSERT INTO caseT (" + CASET_NAME + ", " + CASET_PUBLIC + ", "
				+ CASET_DESCRIPTION + ") values (\"" + caseName + "\", " + (isPublic ? 1 : 0) + ", \"" + description + "\")";
		System.out.println(temp);
		//return st.executeUpdate(temp);
		return 5;
	}
	
	public int getCatID(String name) throws SQLException {
		String temp = "SELECT id category where name=\""+name+"\"";
		ResultSet rs = st.executeQuery(temp);
		int id = -1;
		while(rs.next()){
			id = rs.getInt("id");
		}
		return id;
		
	}

}
