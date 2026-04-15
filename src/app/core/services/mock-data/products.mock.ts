import { Product } from '../../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001', sku: 'ELEC-MON-001',
    name: 'Dell UltraSharp 27" 4K Monitor',
    description: 'Professional IPS display with 99% sRGB coverage and USB-C connectivity.',
    category: 'Electronics', price: 48000, stock: 8, reorderLevel: 10,
    createdAt: '2023-01-10T09:00:00Z',
  },
  {
    id: 'prod-002', sku: 'ELEC-LAP-002',
    name: 'ThinkPad X1 Carbon Gen 11',
    description: 'Enterprise ultrabook with Intel Core i7, 16GB RAM, 512GB SSD.',
    category: 'Electronics', price: 145000, stock: 15, reorderLevel: 5,
    createdAt: '2023-01-12T09:00:00Z',
  },
  {
    id: 'prod-003', sku: 'OFF-CHR-001',
    name: 'Ergonomic Office Chair',
    description: 'Mesh back lumbar support chair with adjustable armrests.',
    category: 'Furniture', price: 18500, stock: 22, reorderLevel: 8,
    createdAt: '2023-02-05T09:00:00Z',
  },
  {
    id: 'prod-004', sku: 'OFF-SUP-001',
    name: 'A4 Premium Copy Paper (500 sheets)',
    description: '80 GSM archival quality paper, ream of 500.',
    category: 'Office Supplies', price: 450, stock: 3, reorderLevel: 20,
    createdAt: '2023-02-10T09:00:00Z',
  },
  {
    id: 'prod-005', sku: 'SOFT-001',
    name: 'Microsoft 365 Business Premium',
    description: 'Annual subscription per user. Includes Teams, OneDrive 1TB.',
    category: 'Software', price: 12500, stock: 50, reorderLevel: 5,
    createdAt: '2023-03-01T09:00:00Z',
  },
  {
    id: 'prod-006', sku: 'HW-NET-001',
    name: 'Cisco Catalyst 2960 Switch (24-port)',
    description: '24-port managed PoE switch for enterprise networking.',
    category: 'Hardware', price: 65000, stock: 0, reorderLevel: 3,
    createdAt: '2023-03-15T09:00:00Z',
  },
  {
    id: 'prod-007', sku: 'ELEC-KBD-001',
    name: 'Logitech MX Keys Wireless Keyboard',
    description: 'Multi-device backlit keyboard with smart illumination.',
    category: 'Electronics', price: 9500, stock: 30, reorderLevel: 10,
    createdAt: '2023-04-01T09:00:00Z',
  },
  {
    id: 'prod-008', sku: 'FUR-DESK-001',
    name: 'Height-Adjustable Standing Desk',
    description: 'Electric sit-stand desk, 120x60cm. Memory presets for 3 heights.',
    category: 'Furniture', price: 35000, stock: 7, reorderLevel: 5,
    createdAt: '2023-04-20T09:00:00Z',
  },
];