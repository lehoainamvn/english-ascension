package com.englishascension.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		String databaseUrl = System.getenv("DATABASE_URL");
		if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
			try {
				String cleanUrl = databaseUrl;
				if (cleanUrl.startsWith("postgres://")) {
					cleanUrl = cleanUrl.substring(11);
				} else if (cleanUrl.startsWith("postgresql://")) {
					cleanUrl = cleanUrl.substring(13);
				}
				
				int atIndex = cleanUrl.lastIndexOf('@');
				if (atIndex != -1) {
					String userInfo = cleanUrl.substring(0, atIndex);
					String hostInfo = cleanUrl.substring(atIndex + 1);
					
					String username = "";
					String password = "";
					int colonIndex = userInfo.indexOf(':');
					if (colonIndex != -1) {
						username = userInfo.substring(0, colonIndex);
						password = userInfo.substring(colonIndex + 1);
					} else {
						username = userInfo;
					}
					
					String jdbcUrl = "jdbc:postgresql://" + hostInfo;
					if (!jdbcUrl.contains("sslmode=")) {
						if (jdbcUrl.contains("?")) {
							jdbcUrl += "&sslmode=require";
						} else {
							jdbcUrl += "?sslmode=require";
						}
					}
					
					System.setProperty("spring.datasource.url", jdbcUrl);
					System.setProperty("spring.datasource.username", username);
					System.setProperty("spring.datasource.password", password);
					
					System.out.println("[DatabaseConfig] Auto-configured JDBC datasource from DATABASE_URL.");
					System.out.println("[DatabaseConfig] Parsed JDBC URL: " + jdbcUrl + " | Username: " + username);
				} else {
					System.err.println("[DatabaseConfig] DATABASE_URL does not contain '@' separator.");
				}
			} catch (Exception e) {
				System.err.println("[DatabaseConfig] Failed to parse DATABASE_URL: " + e.getMessage());
				e.printStackTrace();
			}
		} else {
			System.out.println("[DatabaseConfig] DATABASE_URL is not set in environment. Falling back to application.properties defaults.");
		}
		SpringApplication.run(BackendApplication.class, args);
	}

}
