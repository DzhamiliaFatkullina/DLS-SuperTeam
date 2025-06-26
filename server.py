from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

PORT = 8000

class RequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle favicon request
        if self.path == '/favicon.ico':
            self.send_response(204)
            return
        # Serve all other requests normally
        super().do_GET()

def run():
    web_dir = os.path.join(os.path.dirname(__file__))
    os.chdir(web_dir)
    
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()