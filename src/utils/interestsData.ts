
import { faker } from '@faker-js/faker';

export interface Interest {
  id: string;
  name: string;
  category: string;
}

const generateInterests = (): Interest[] => {
  const categories = [
    'Fashion', 'Electronics', 'Home & Garden', 'Sports & Outdoors', 
    'Beauty & Personal Care', 'Books & Media', 'Toys & Games', 'Food & Beverages',
    'Health & Wellness', 'Automotive', 'Travel & Luggage', 'Jewelry & Accessories',
    'Arts & Crafts', 'Office Supplies', 'Pet Supplies', 'Baby & Kids'
  ];
  
  const interests: Interest[] = [];
  
  for (let i = 0; i < 100; i++) {
    interests.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories)
    });
  }
  
  return interests;
};

export const interestsData = generateInterests();
