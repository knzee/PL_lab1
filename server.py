from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json

def killfavicon(str):
	if (str == '/favicon.ico'): return True
	return False

class MyRqH(BaseHTTPRequestHandler):	
	def do_GET(self):
		def createFolder(folder_name,path):
			os.mkdir(path+'/'+folder_name)
			
		def deleteEmptyFolder(folder_name,path):
			os.rmdir(path+'/'+folder_name)
			
		if (killfavicon(self.path) == True): return	
		
		self.send_response(200)
		
		#Парсим строку на путь и запросы
		parsed_path = self.path.split("?")
		path = parsed_path[0]
		try:
			query = parsed_path[1].split("&")
		except:
			query = [];
			
		print('self.path = ',self.path)
		print('path = ',path)
		print('query = ',query)
		
		json_list = []
		basedir = os.getcwd()
		curdir = basedir + path				
		if (os.path.isfile(curdir)):
			self.send_header('Content-Disposition','attachment')
			self.end_headers()
		else: 
			self.send_header('content-type','application/json')
			self.end_headers()
			#Обработка запроса
			for q in query:
				temp = q.split("=")
				if (temp[0] == 'cref'): 
					createFolder(temp[1],curdir)
				if (temp[0] == 'delef'):
					deleteEmptyFolder(temp[1],curdir)
					
			for name in os.listdir(curdir):
				path = os.path.join(curdir,name)
				json_list.append({'basename': os.path.basename(path),'f_size' : os.stat(path).st_size,'is_file': os.path.isfile(path)})
			self.wfile.write(json.dumps(json_list).encode())
		
		
httpd = HTTPServer(("",8080), MyRqH)
httpd.serve_forever()
