'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_MENU_ITEMS, MENU_CATEGORIES } from '@/data/menuData';
import { MenuItem, MenuCategoryType, MenuCategory } from '@/types/menu';
import { Modal } from '@/components/common/Modal';
import { 
  BiSearch, 
  BiPlus, 
  BiEdit, 
  BiTrash, 
  BiGridAlt, 
  BiListUl, 
  BiCheck, 
  BiFoodMenu, 
  BiTrendingUp,
  BiLayer,
  BiPackage,
  BiTime,
  BiDetail
} from 'react-icons/bi';

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTiming, setSelectedTiming] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Starters' as MenuCategoryType,
    description: '',
    price: 250,
    discountedPrice: '',
    isVeg: true,
    isAvailable: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&h=300&q=80',
    preparationTime: 15,
    timingTag: 'All Day' as 'All Day' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Happy Hour',
    isWeightBased: false,
    pricePerKg: 500,
    isCustomCake: false,
    kitchenStation: 'Main Kitchen' as 'Main Kitchen' | 'Bakery' | 'Beverage Counter' | 'Pizza Station',
  });

  const [newCatName, setNewCatName] = useState('');

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTiming = selectedTiming === 'All' || item.timingTag === selectedTiming || item.timingTag === 'All Day';
    const matchesVeg = 
      vegFilter === 'all' || 
      (vegFilter === 'veg' && item.isVeg) || 
      (vegFilter === 'non-veg' && !item.isVeg);
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCat && matchesTiming && matchesVeg && matchesSearch;
  });

  // Toggle availability instantly (In Stock / Out of Stock)
  const handleToggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    }));
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Starters',
      description: '',
      price: 250,
      discountedPrice: '',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&h=300&q=80',
      preparationTime: 15,
      timingTag: 'All Day',
      isWeightBased: false,
      pricePerKg: 500,
      isCustomCake: false,
      kitchenStation: 'Main Kitchen',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
      isVeg: formData.isVeg,
      isAvailable: formData.isAvailable,
      isPopular: formData.isPopular,
      image: formData.image,
      preparationTime: Number(formData.preparationTime),
      timingTag: formData.timingTag,
      isWeightBased: formData.isWeightBased,
      pricePerKg: formData.isWeightBased ? Number(formData.pricePerKg) : undefined,
      isCustomCake: formData.isCustomCake,
      kitchenStation: formData.kitchenStation,
    };
    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      discountedPrice: item.discountedPrice ? String(item.discountedPrice) : '',
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isPopular: !!item.isPopular,
      image: item.image,
      preparationTime: item.preparationTime,
      timingTag: item.timingTag || 'All Day',
      isWeightBased: !!item.isWeightBased,
      pricePerKg: item.pricePerKg || 500,
      isCustomCake: !!item.isCustomCake,
      kitchenStation: (item.kitchenStation as any) || 'Main Kitchen',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: Number(formData.price),
          discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
          isVeg: formData.isVeg,
          isAvailable: formData.isAvailable,
          isPopular: formData.isPopular,
          image: formData.image,
          preparationTime: Number(formData.preparationTime),
          timingTag: formData.timingTag,
          isWeightBased: formData.isWeightBased,
          pricePerKg: formData.isWeightBased ? Number(formData.pricePerKg) : undefined,
          isCustomCake: formData.isCustomCake,
          kitchenStation: formData.kitchenStation,
        };
      }
      return item;
    }));
    setIsEditModalOpen(false);
  };

  const handleOpenDelete = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;
    setItems(items.filter(i => i.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
  };

  const handleOpenRecipe = (item: MenuItem) => {
    setSelectedItem(item);
    setIsRecipeModalOpen(true);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim() as MenuCategoryType,
      itemCount: 0,
      iconName: 'BiFoodMenu',
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setIsCatModalOpen(false);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Title & Actions */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Menu & Dish Catalog</h4>
          <p className="text-muted-custom small mb-0">
            Create items, configure portion variants, weight rates, recipe inventory mapping, and live stock availability
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-1 shadow-sm"
            onClick={() => setIsCatModalOpen(true)}
          >
            <BiLayer size={18} />
            <span>Manage Categories</span>
          </button>

          <button
            type="button"
            className="btn btn-brand d-flex align-items-center gap-2 shadow-sm text-white"
            onClick={handleOpenAdd}
          >
            <BiPlus size={20} />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-surface border-subtle text-muted">
                <BiSearch size={18} />
              </span>
              <input
                type="text"
                className="form-control border-subtle"
                placeholder="Search dish name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Meal Timing Filter */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-1">
              <BiTime className="text-muted flex-shrink-0" />
              <select
                className="form-select form-select-sm border-subtle text-navy"
                value={selectedTiming}
                onChange={(e) => setSelectedTiming(e.target.value)}
              >
                <option value="All">All Timings</option>
                <option value="Breakfast">Breakfast Menu</option>
                <option value="Lunch">Lunch Menu</option>
                <option value="Dinner">Dinner Menu</option>
                <option value="Happy Hour">Happy Hour</option>
              </select>
            </div>
          </div>

          {/* Pure Veg / Non-Veg filter */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted-custom fw-semibold">Diet:</span>
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${vegFilter === 'all' ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setVegFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${vegFilter === 'veg' ? 'btn-success text-white fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setVegFilter('veg')}
                >
                  Veg
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${vegFilter === 'non-veg' ? 'btn-danger text-white fw-semibold' : 'btn-outline-secondary'}`}
                  onClick={() => setVegFilter('non-veg')}
                >
                  Non-Veg
                </button>
              </div>
            </div>
          </div>

          {/* Grid / Table View Switcher */}
          <div className="col-12 col-md-2 text-md-end">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <BiGridAlt size={16} />
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'table' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <BiListUl size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pt-3 border-top border-subtle mt-3 pb-1">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 text-nowrap ${
              selectedCategory === 'All' ? 'btn-brand fw-bold shadow-sm text-white' : 'btn-light text-navy'
            }`}
            onClick={() => setSelectedCategory('All')}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                selectedCategory === cat.name ? 'btn-brand fw-bold shadow-sm text-white' : 'btn-light text-navy'
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: GRID */}
      {viewMode === 'grid' ? (
        <div className="row g-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
              <div className="app-card h-100 d-flex flex-column justify-content-between overflow-hidden shadow-sm">
                <div>
                  <div className="position-relative" style={{ height: '140px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 m-2 bg-white rounded-1 p-1 shadow-sm">
                      <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`} />
                    </div>

                    <div className="position-absolute top-0 end-0 m-2 d-flex flex-column align-items-end gap-1">
                      {item.isPopular && (
                        <span className="badge bg-brand text-white rounded-pill px-2 py-1 shadow-sm" style={{ fontSize: '10px' }}>
                          Popular
                        </span>
                      )}
                      {item.isWeightBased && (
                        <span className="badge bg-info text-white rounded-pill px-2 py-1 shadow-sm" style={{ fontSize: '10px' }}>
                          ₹{item.pricePerKg}/kg
                        </span>
                      )}
                      {item.isCustomCake && (
                        <span className="badge bg-warning text-dark rounded-pill px-2 py-1 shadow-sm" style={{ fontSize: '10px' }}>
                          Custom Cake
                        </span>
                      )}
                    </div>

                    {!item.isAvailable && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center text-white fw-bold small text-uppercase">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold text-navy mb-0 text-truncate" title={item.name}>
                        {item.name}
                      </h6>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1 mb-2 flex-wrap">
                      <span className="badge bg-light text-muted-custom border" style={{ fontSize: '10px' }}>
                        {item.category}
                      </span>
                      {item.timingTag && (
                        <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>
                          {item.timingTag}
                        </span>
                      )}
                    </div>

                    <p className="text-muted-custom small mb-2 line-clamp-2" style={{ fontSize: '12px', minHeight: '36px' }}>
                      {item.description}
                    </p>

                    <div className="d-flex align-items-baseline justify-content-between mb-2">
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fw-bold fs-6 text-navy">
                          ₹{item.discountedPrice || item.price}
                        </span>
                        {item.discountedPrice && (
                          <span className="text-muted text-decoration-line-through small">
                            ₹{item.price}
                          </span>
                        )}
                      </div>

                      {item.recipeIngredients && item.recipeIngredients.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-xs btn-outline-secondary p-1 d-flex align-items-center gap-1"
                          style={{ fontSize: '10px' }}
                          onClick={() => handleOpenRecipe(item)}
                          title="View linked inventory ingredients"
                        >
                          <BiPackage size={12} />
                          <span>{item.recipeIngredients.length} Recipe Ings</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card footer: Availability Toggle + Edit/Delete */}
                <div className="p-3 bg-surface border-top border-subtle d-flex align-items-center justify-content-between">
                  {/* Availability switch */}
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      role="switch"
                      id={`avail-${item.id}`}
                      checked={item.isAvailable}
                      onChange={() => handleToggleAvailability(item.id)}
                    />
                    <label className="form-check-label small cursor-pointer" htmlFor={`avail-${item.id}`} style={{ fontSize: '11px' }}>
                      {item.isAvailable ? <span className="text-success fw-semibold">In Stock</span> : <span className="text-danger fw-semibold">Out of Stock</span>}
                    </label>
                  </div>

                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary p-1"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Item"
                    >
                      <BiEdit size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger p-1"
                      onClick={() => handleOpenDelete(item)}
                      title="Delete Item"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: TABLE */
        <div className="app-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Diet</th>
                  <th>Base Price</th>
                  <th>Prep Time</th>
                  <th>Timing</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-2 border"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold text-navy small">{item.name}</div>
                          <div className="text-muted-custom" style={{ fontSize: '11px' }}>
                            {item.isWeightBased ? `Weight-Based (₹${item.pricePerKg}/kg)` : item.variants ? `${item.variants.length} portions` : 'Standard'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="small">{item.category}</td>
                    <td>
                      <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`} />
                      <span className="ms-1 small">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </td>
                    <td className="fw-bold text-navy small">₹{item.price}</td>
                    <td className="small text-muted-custom">{item.preparationTime} mins</td>
                    <td className="small">{item.timingTag || 'All Day'}</td>
                    <td>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item.id)}
                        />
                        <span className="small ms-1" style={{ fontSize: '11px' }}>
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {item.recipeIngredients && item.recipeIngredients.length > 0 && (
                          <button
                            type="button"
                            className="btn btn-outline-info p-1"
                            onClick={() => handleOpenRecipe(item)}
                            title="Recipe details"
                          >
                            <BiPackage size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-secondary p-1"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <BiEdit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger p-1"
                          onClick={() => handleOpenDelete(item)}
                        >
                          <BiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Recipe Mapping Details */}
      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        title={`Recipe Ingredient Mapping: ${selectedItem?.name}`}
        subtitle="Automatic stock deduction configured per dish portion"
        size="md"
      >
        <div>
          {selectedItem?.recipeIngredients && selectedItem.recipeIngredients.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Raw Inventory Ingredient</th>
                    <th>Portion Qty</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.recipeIngredients.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-semibold text-navy small">{r.ingredientName}</td>
                      <td className="text-brand fw-bold small">{r.quantity}</td>
                      <td className="small text-muted">{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-light rounded-2 text-muted-custom small">
                Whenever this dish is ordered at the POS terminal, these raw ingredient amounts are automatically deducted in real-time from your live inventory stock.
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted">No recipe ingredients mapped yet for this dish.</div>
          )}
        </div>
      </Modal>

      {/* Modal: Add Food Item */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Menu Item"
        subtitle="Publish a dish to the restaurant catalog"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Item / Dish Name</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              placeholder="e.g. Kaju Katli or Artisan Cold Brew"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Category</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Diet Type</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.isVeg ? 'veg' : 'non-veg'}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'veg' })}
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Base Price (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Offer Price (Optional ₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                placeholder="Discounted"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Multi-business features: Weight-based and Custom Cake toggles */}
          <div className="p-2 mb-3 rounded-2 bg-light border border-subtle">
            <div className="row g-2 align-items-center">
              <div className="col-6">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="weightCheck"
                    checked={formData.isWeightBased}
                    onChange={(e) => setFormData({ ...formData, isWeightBased: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-navy" htmlFor="weightCheck">
                    Weight-Based Billing (Mithai)
                  </label>
                </div>
              </div>
              <div className="col-6">
                {formData.isWeightBased && (
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white">₹/kg</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.pricePerKg}
                      onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Meal Timing Tag</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.timingTag}
                onChange={(e) => setFormData({ ...formData, timingTag: e.target.value as any })}
              >
                <option value="All Day">All Day</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Happy Hour">Happy Hour</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Prep Time (Mins)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Dish Description</label>
            <textarea
              className="form-control form-control-sm border-subtle"
              rows={2}
              placeholder="Ingredients and culinary style..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top border-subtle">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm text-white">
              Add to Menu
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Food Item */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Menu Item"
        subtitle={`Updating ${selectedItem?.name}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Item / Dish Name</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Category</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Base Price (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Meal Timing</label>
              <select
                className="form-select form-select-sm border-subtle"
                value={formData.timingTag}
                onChange={(e) => setFormData({ ...formData, timingTag: e.target.value as any })}
              >
                <option value="All Day">All Day</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Happy Hour">Happy Hour</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-navy">Prep Time (mins)</label>
              <input
                type="number"
                className="form-control form-control-sm border-subtle"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Description</label>
            <textarea
              className="form-control form-control-sm border-subtle"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top border-subtle">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm text-white">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Delete Item Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Menu Item"
        size="sm"
        footer={
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>
              Confirm Delete
            </button>
          </div>
        }
      >
        <p className="mb-0 text-navy">
          Are you sure you want to remove <strong>{selectedItem?.name}</strong> from the restaurant menu?
        </p>
      </Modal>

      {/* Modal: Category Management */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Manage Menu Categories"
        size="md"
      >
        <div>
          <label className="small fw-semibold text-navy mb-2">Existing Categories</label>
          <div className="d-flex gap-2 flex-wrap mb-4">
            {categories.map((c) => (
              <span key={c.id} className="badge bg-light text-navy border p-2 d-flex align-items-center gap-2">
                <span>{c.name}</span>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddCategory}>
            <label className="form-label small fw-semibold text-navy">Add New Category</label>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control border-subtle"
                placeholder="e.g. Sizzlers & Grills"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-brand text-white">
                Add Category
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
