#!/bin/sh
cd /home/fergie/printer_service/jetty-distribution-7.5.3.v20111011/ 
java -Dorg.eclipse.jetty.server.Request.maxFormContentSize=2000000 -Dcash_drawer_script_path=/home/lee/open_cash_drawer.sh -jar /home/fergie/printer_service/jetty-distribution-7.5.3.v20111011/start.jar

