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


[["Ataxia","experimental rock|post-punk|psychedelic rock|electronica|art rock"],
["Audioslave","alternative metal|post-grunge|alternative rock|hard rock"],
["Axis of Justice","alternative rock"],
["Dominus","death metal"],
["Future User","electronic rock"],
["Jane's Addiction","funk metal|neo-psychedelia|alternative metal|alternative rock|psychedelic rock"],
["John Frusciante","rock"],
["One Day as a Lion","rap rock"],
["Prophets of Rage","rap metal|rap rock"],
["Rage Against the Machine","rap rock|alternative metal|funk metal|rap metal|nu metal"],
["Red Hot Chili Peppers","alternative rock|funk rock|rap rock|funk metal"],
["Soundgarden","hard rock|alternative metal|alternative rock|heavy metal|grunge"],
["Street Sweeper Social Club","funk rock|hard rock|rap rock"],
["System of a Down","nu metal|hard rock|progressive metal|alternative metal"],
["Temple of the Dog","grunge"],
["The Last Internationale","alternative rock"],
["The Mars Volta","progressive rock|experimental rock"],
["The Nightwatchman","folk rock"],
["Volbeat","psychobilly|heavy metal|hard rock"],
["WAKRAT","hard rock|alternative rock|punk rock"]]
