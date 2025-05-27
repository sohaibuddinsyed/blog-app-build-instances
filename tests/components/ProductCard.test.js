import { render, screen } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return (
      <a href={href}>
        {children}
      </a>
    );
  };
});

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    rating: 4.5,
    imageUrl: 'https://picsum.photos/seed/1/400/300',
    category: 'Electronics',
    brand: 'TestBrand'
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.5/5')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://picsum.photos/seed/1/400/300');
  });

  it('links to the correct product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('applies sale styling when product is on sale', () => {
    const saleProduct = {
      ...mockProduct,
      onSale: true,
      originalPrice: 129.99
    };
    
    render(<ProductCard product={saleProduct} />);
    
    expect(screen.getByText('$99.99')).toHaveClass('salePrice');
    expect(screen.getByText('$129.99')).toHaveClass('originalPrice');
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stock: 0
    };
    
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows low stock warning when stock is below 5', () => {
    const lowStockProduct = {
      ...mockProduct,
      stock: 3
    };
    
    render(<ProductCard product={lowStockProduct} />);
    
    expect(screen.getByText('Only 3 left!')).toBeInTheDocument();
  });

  // Add more tests for different product states and variations
  for (let i = 0; i < 20; i++) {
    it(`renders product variation ${i} correctly`, () => {
      const variationProduct = {
        ...mockProduct,
        id: i + 100,
        name: `Test Product ${i}`,
        price: 10 * (i + 1),
        rating: (i % 5) + 1,
        stock: i * 10
      };
      
      render(<ProductCard product={variationProduct} />);
      
      expect(screen.getByText(`Test Product ${i}`)).toBeInTheDocument();
      expect(screen.getByText(`$${10 * (i + 1)}.00`)).toBeInTheDocument();
      expect(screen.getByText(`Rating: ${(i % 5) + 1}/5`)).toBeInTheDocument();
    });
  }
});
