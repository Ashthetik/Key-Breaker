[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]
Invoke-WebRequest -Uri "https://www.python.org/ftp/3.9.6.exe" -OutFile "c:/temp/python-3.9.6.exe"
c:/temp/python-3.9.6.exe /quiet InstallAllUsers=0 PrependPath=1 Include_test=0

cinst nodejs.install