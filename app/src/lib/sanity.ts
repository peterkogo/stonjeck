import groq from 'groq';

const allWorksQuery = groq`
  *[_type == "work"] | order(year desc) {
    _id,
    title,
    image,
    year,
    size,
    description,
    medium-> {
      name
    }
  }
`;
