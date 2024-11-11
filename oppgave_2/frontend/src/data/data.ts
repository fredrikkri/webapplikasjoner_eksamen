import {Event as EventType} from "../types/Event"

export const dummyEvents: EventType[] = [
    {
      id: "1",
      title: "Sommerkonsert",
      description: "En hyggelig konsert med lokale artister ved sjøen.",
      date: new Date("2024-06-15T18:00:00"),
      location: "Frogner, Oslo",
      isFull: false,
      slug: 'sommerkonsert'
    },
    {
      id: "2",
      title: "Workshop: Webutvikling",
      description: "Lær grunnleggende HTML, CSS og JavaScript.",
      date: new Date("2024-06-15T18:00:00"),
      location: "Halden",
      isFull: true,
      slug: 'workshop-webutvikling'
    },
    {
      id: "3",
      title: "Fredagsjoggen",
      description: "Bli med på vår ukentlige joggetur gjennom parken.",
      date: new Date("2024-06-15T18:00:00"),
      location: "Fredrikstad, Østfold",
      isFull: false,
      slug: 'fredagsjoggen'
    },
    {
      id: "4",
      title: "Kurs i matlaging",
      description: "Lær hvordan du lager en 3-retters middag med vår kokk.",
      date: new Date("2024-06-15T18:00:00"),
      location: "Sarpsbord, Østfold",
      isFull: false,
      slug: 'kurs-i-matlaging'
    },
    {
      id: "5",
      title: "Fotoutstilling",
      description: "Se fantastiske fotografier fra hele verden.",
      date: new Date("2024-06-15T18:00:00"),
      location: "Fredrikstad, Østfold",
      isFull: true,
      slug: 'fotoutstilling'
    },
  ];