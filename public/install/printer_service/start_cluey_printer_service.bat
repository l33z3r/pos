cd c:\cluey\printer_service\jetty-distribution-7.5.3.v20111011

java -Dorg.eclipse.jetty.server.Request.maxFormContentSize=2000000 -Dopen_cash_drawer_batch_file_path=c:\cluey\printer_service\open_cash_drawer.bat -Dzalion_roomfile_file_path=c:\cluey\printer_service\zalion\ROOMFILE.TXT -Dzalion_postings_file_path=c:\cluey\printer_service\zalion\POSTINGS.TXT -jar start.jar
