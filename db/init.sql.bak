use mydb;

/* 사용자정보 */
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_users (username)
);

/* 공성전 */
CREATE TABLE IF NOT EXISTS user_siege (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    std_date VARCHAR(10),
    score INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_users (username, std_date)
);

/* 길드전 */
CREATE TABLE IF NOT EXISTS user_guild (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    std_date VARCHAR(10),
    result VARCHAR(20),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_users (username, std_date)
);