SELECT
    b.name
    ,string_agg(g.name, '|') as genres
FROM 
    dim_genre g
    join fct_band_genre bg
        on g.id = bg.genreid
    join dim_band b
        on b.id = bg.bandid
WHERE
    b.name in (
          'Audioslave'
         ,'Red Hot Chili Peppers'
         ,'Volbeat'
         ,'WAKRAT'
         ,'Axis of Justice'
         ,'Rage Against the Machine'
         ,'Soundgarden'
         ,'Street Sweeper Social Club'
         ,'Future User'
         ,'Ataxia'
         ,'The Mars Volta'
         ,'Jane''s Addiction'
         ,'John Frusciante'
         ,'Dominus'
         ,'Prophets of Rage'
         ,'System of a Down'
         ,'One Day as a Lion'
         ,'The Nightwatchman'
         ,'The Last Internationale'
         ,'Temple of the Dog'
    )
GROUP BY 
    b.name
