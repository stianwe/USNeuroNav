public class MediaUploader {

	private static String DB_HOSTNAME;
	private static String DB_NAME;
	private static int DB_PORT;
	private static String DB_USERNAME;
	private static String DB_PASSWORD;
	private SQLHelper sql;
	
	private static final String[] VALID_VIDEO_FORMATS = new String[] {".mov",".mp4"};
	private static final String[] VALID_IMAGE_FORMATS = new String[] {".jpg"};
	
	public MediaUploader(SQLHelper sql){
		DB_HOSTNAME = "mysql://localhost";
		DB_NAME = "USNeuroNav";
		DB_PORT = 3306;
		DB_USERNAME = "root";
		DB_PASSWORD = "";
		this.sql = sql;
	}
	
	
	
	public void uploadMedia(String[] args) {
		if (args.length != 3) {
			printInfo();
			return;
		}
		String dir = args[1];
		
		int caseId = -1;
		try {
			caseId = Integer.parseInt(args[0]);
		} catch (NumberFormatException e) {
			System.out.println("case ID must be an integer");
			printInfo();
			return;
		}
		boolean isPublic;
		if (args[2].equalsIgnoreCase("public")) {
			isPublic = true;
		} else if (args[2].equalsIgnoreCase("private")) {
			isPublic = false;
		} else {
			System.out.println("\"public\" or \"private\" must be specified as visibility");
			printInfo();
			return;
		}
		String[] files = FileFinder.findFiles(dir);
		System.out.println("Files: ");
		for (String string : files) {
			System.out.println(string);
		}
		try {
			//SQLHelper sql = new SQLHelper(DB_HOSTNAME, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD);
			//sql.connect();
			String rootPath;
			if (dir.endsWith("media") || dir.endsWith("media/")) {
				rootPath = "";
			} else {
				String[] temp = dir.split("media/");
				rootPath = temp[temp.length - 1] + "/";
			}
			for (String file : files) {
				boolean sendData = false;
				boolean isVideo = false;
				for (String format : VALID_VIDEO_FORMATS) {
					if (file.endsWith(format)) {
						isVideo = true;
						sendData = true;
						
					}
				}
				
				if (!isVideo){
					for (String format : VALID_IMAGE_FORMATS) {
						if (file.endsWith(format)) {
							sendData = true;
						}
					}
					
					
				}
				
				if (sendData)
					sql.insertMediaFile(rootPath + file, isVideo, isPublic, caseId);
				
			}
		} catch (Exception e) {
			System.out.println("Error while communicating with database: " + e);
		}
	}
	
	public static void printInfo() {
		System.out.println("Usage: upload <case ID> <dir> <visibility (public/private)>");
	}
}
