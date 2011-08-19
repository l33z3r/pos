#if defined?(Footnotes) && Rails.env.development?
#  Footnotes.run! # first of all
#  
#  Footnotes::Filter.prefix = 'nb_editor://open?url=file://%s&line=%d&column=%d'
#end