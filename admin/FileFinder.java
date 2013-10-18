import java.io.File;


public class FileFinder {

	public static String[] findFiles(String dir) {
		File root = new File(dir);
		if (!root.isDirectory()) {
			throw new IllegalArgumentException("Argument was not a directory: " + dir);
		}
		return root.list();
	}
}
