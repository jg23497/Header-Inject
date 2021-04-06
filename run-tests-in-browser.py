#!/usr/bin/env python3

if __name__ == "__main__":

    import http.server
    import socketserver
    import threading
    import webbrowser
    import time
    import os

    PORT = 8000

    directory_path = os.path.dirname(os.path.realpath(__file__))

    class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory_path, **kwargs)

        def end_headers(self):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            http.server.SimpleHTTPRequestHandler.end_headers(self)

    def run_server():
        CORSRequestHandler.extensions_map.update({
            ".js": "application/javascript"
        })

        httpd = socketserver.TCPServer(("", PORT), CORSRequestHandler)

        try:
            httpd.serve_forever()
        except (KeyboardInterrupt, SystemExit):
            httpd.shutdown()

    def open_browser():
        time.sleep(3)
        url = "http://localhost:{port}/tests/Run.html".format(port=PORT)
        webbrowser.open(url)
    
    open_browser_thread = threading.Thread(target=open_browser)
    open_browser_thread.start()
    run_server()