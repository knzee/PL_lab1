from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json
import shutil

def killfavicon(str):
	if (str == '/favicon.ico'): return True
	return False

def createFolder(folder_name,path):
	os.mkdir(path+'/'+folder_name)

def deleteSmth(folder_name,path):
	if (os.path.isdir(path+'/'+folder_name) == True):
		shutil.rmtree(path+'/'+folder_name)
	else: os.remove(path+'/'+folder_name)

def openHTML(self,curdir,mimetype):
	f = open(curdir,'rb')
	self.send_response(200)
	self.send_header('Content-type',mimetype)
	self.end_headers()
	self.wfile.write(f.read())

def getMtype(ext):
	if ext==".html":
		return 'text/html'
	if ext==".js" :
		return 'application/javascript'
	if ext==".css":
		return 'text/css'
	if ext==".png":
		return 'image/png'
	return False

class MyRqH(BaseHTTPRequestHandler):
	def do_GET(self):
		if (killfavicon(self.path) == True): return
		if (self.path=='/'):
			self.path='/site.html'

		#Парсим строку на путь и запросы
		parsed_path = self.path.split("?")
		path = parsed_path[0]
		try:
			query = parsed_path[1].split("&")
		except:
			query = [];

		json_list = []
		basedir = os.getcwd()
		curdir = basedir + path

		mimetype = getMtype(os.path.splitext(path)[1])

		print(getMtype(os.path.splitext(path)[1]))

		if mimetype != False:
			openHTML(self,curdir,mimetype)
		else:
			if (os.path.isfile(curdir)):
				f = open(curdir,'rb')
				self.send_response(200)
				self.send_header('Content-Disposition','attachment')
				self.end_headers()
				self.wfile.write(f.read())
			else:
				self.send_response(200)
				self.send_header('content-type','application/json')
				self.end_headers()
				#Обработка запроса
				for q in query:
					temp = q.split("=")
					if (temp[0] == 'cref'):
						createFolder(temp[1],curdir)
					if (temp[0] == 'del'):
						deleteSmth(temp[1],curdir)

				for name in os.listdir(curdir):
					path = os.path.join(curdir,name)
					json_list.append({'basename': os.path.basename(path),'f_size' : os.stat(path).st_size,'is_file': os.path.isfile(path)})
				self.wfile.write(bytes(json.dumps(json_list), 'utf-8'))


httpd = HTTPServer(("",8080), MyRqH)
httpd.serve_forever()
