
public class Main {

	private static final String DB_HOSTNAME = "mysql://localhost";
	private static final String DB_NAME = "USNeuroNav";
	private static final int DB_PORT = 3306;
	private static final String DB_USERNAME = "root";
	private static final String DB_PASSWORD = "";
	
	private static final String[] VALID_VIDEO_FORMATS = new String[] {".mov"};
	
	public static void main(String[] args) {
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
			SQLHelper sql = new SQLHelper(DB_HOSTNAME, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD);
			sql.connect();
			String rootPath;
			if (dir.endsWith("media") || dir.endsWith("media/")) {
				rootPath = "";
			} else {
				String[] temp = dir.split("media/");
				rootPath = temp[temp.length - 1] + "/";
			}
			for (String file : files) {
				boolean isVideo = false;
				for (String format : VALID_VIDEO_FORMATS) {
					if (file.endsWith(format)) {
						isVideo = true;
						break;
					}
				}
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
