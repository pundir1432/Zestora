'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_RECIPE_COSTING } from '@/data/saasData';
import { RecipeDetail, RecipeIngredientCost } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiDish,
  BiPlus,
  BiSearch,
  BiPieChartAlt2,
  BiTrendingUp,
  BiInfoCircle,
  BiCheckCircle,
  BiTrash,
  BiEdit,
  BiDetail,
} from 'react-icons/bi';

export default function BusinessOwnerRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeDetail[]>(SAMPLE_RECIPE_COSTING);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(recipes[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Recipe Form
  const [newDishName, setNewDishName] = useState('');
  const [newCategory, setNewCategory] = useState('Main Course');
  const [newSellingPrice, setNewSellingPrice] = useState(300);
  const [newPrepTime, setNewPrepTime] = useState(15);
  const [newIsVeg, setNewIsVeg] = useState(true);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientCost[]>([
    { ingredientId: 'ing-1', name: 'Fresh Paneer', quantity: 0.2, unit: 'kg', costPerUnit: 340, totalCost: 68 },
    { ingredientId: 'ing-2', name: 'Butter Glaze', quantity: 0.02, unit: 'kg', costPerUnit: 480, totalCost: 9.6 },
  ]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchSearch =
        r.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [recipes, searchTerm, categoryFilter]);

  const avgFoodCost = useMemo(() => {
    if (recipes.length === 0) return 0;
    const sum = recipes.reduce((acc, r) => acc + r.foodCostPercentage, 0);
    return (sum / recipes.length).toFixed(1);
  }, [recipes]);

  const handleUpdateIngRow = (idx: number, field: keyof RecipeIngredientCost, val: any) => {
    setRecipeIngredients((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      if (field === 'quantity' || field === 'costPerUnit') {
        const q = Number(copy[idx].quantity) || 0;
        const c = Number(copy[idx].costPerUnit) || 0;
        copy[idx].totalCost = Math.round(q * c * 100) / 100;
      }
      return copy;
    });
  };

  const handleAddIngRow = () => {
    setRecipeIngredients((prev) => [
      ...prev,
      { ingredientId: `ing-${Date.now()}`, name: '', quantity: 0.1, unit: 'kg', costPerUnit: 100, totalCost: 10 },
    ]);
  };

  const handleRemoveIngRow = (idx: number) => {
    if (recipeIngredients.length > 1) {
      setRecipeIngredients((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const calculatedRawCost = useMemo(() => {
    return recipeIngredients.reduce((acc, it) => acc + (it.totalCost || 0), 0);
  }, [recipeIngredients]);

  const calculatedFoodCostPct = useMemo(() => {
    if (!newSellingPrice || newSellingPrice === 0) return 0;
    return ((calculatedRawCost / newSellingPrice) * 100).toFixed(1);
  }, [calculatedRawCost, newSellingPrice]);

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const rawCost = Math.round(calculatedRawCost * 100) / 100;
    const fcPct = Number(calculatedFoodCostPct);
    const profitMargin = Math.round((100 - fcPct) * 100) / 100;

    const newRec: RecipeDetail = {
      id: `rcp-${Date.now()}`,
      menuItemId: `mi-${Date.now()}`,
      dishName: newDishName,
      category: newCategory,
      sellingPrice: Number(newSellingPrice),
      isVeg: newIsVeg,
      preparationTimeMinutes: Number(newPrepTime),
      totalRawCost: rawCost,
      foodCostPercentage: fcPct,
      profitMargin,
      ingredients: recipeIngredients,
    };

    setRecipes([newRec, ...recipes]);
    setSelectedRecipe(newRec);
    setShowAddModal(false);
  };

  const getCostBadge = (pct: number) => {
    if (pct <= 28) {
      return <span className="badge bg-success-subtle text-success border border-success-subtle">{pct}% (High Margin)</span>;
    } else if (pct <= 34) {
      return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">{pct}% (Healthy)</span>;
    } else {
      return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">{pct}% (High Cost Alert)</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'kitchen_staff']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Recipe & Food Costing Studio</h1>
            <p className="text-muted small mb-0">
              Map dish ingredients down to grams and ml, audit portion costs, and track real-time food cost % against target profitability.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Add Dish Recipe
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Configured Recipes</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiDish size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{recipes.length} Standardized Dishes</h3>
              <span className="text-muted small">Auto-deducted from inventory upon KOT</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Average Menu Food Cost %</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiPieChartAlt2 size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{avgFoodCost}%</h3>
              <span className="text-success small fw-medium">Under the 32.0% industry target threshold</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Average Gross Margin</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{(100 - Number(avgFoodCost)).toFixed(1)}%</h3>
              <span className="text-muted small">Healthy contribution towards fixed overheads</span>
            </div>
          </div>
        </div>

        {/* Two-Column Explorer: Left List, Right Recipe Breakdown */}
        <div className="row g-4">
          {/* Left: Recipe List */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="card-header bg-white border-bottom p-3">
                <div className="input-group input-group-sm mb-2">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search dishes or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-1 overflow-auto">
                  {['All', 'Main Course', 'Biryani & Rice', 'Beverages', 'Pizza', 'Breads'].map((cat) => (
                    <button
                      key={cat}
                      className={`btn btn-xs py-1 px-2 ${
                        categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {filteredRecipes.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`list-group-item list-group-item-action p-3 text-start border-bottom ${
                        selectedRecipe?.id === r.id ? 'bg-light border-primary' : ''
                      }`}
                      onClick={() => setSelectedRecipe(r)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">{r.dishName}</span>
                        <span className="fw-bold text-primary" suppressHydrationWarning>₹{formatNumber(r.sellingPrice)}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center small text-muted">
                        <span>{r.category} • {r.ingredients.length} raw ingredients</span>
                        <span>{getCostBadge(r.foodCostPercentage)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selected Recipe Breakdown */}
          <div className="col-12 col-lg-7">
            {selectedRecipe ? (
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span className="badge bg-light text-dark border me-1">
                        {selectedRecipe.category}
                      </span>
                      <span className="badge bg-secondary-subtle text-dark border">
                        Prep: {selectedRecipe.preparationTimeMinutes} mins
                      </span>
                      <h4 className="fw-bold text-dark mt-2 mb-1">{selectedRecipe.dishName}</h4>
                      <div className="text-muted small">
                        Automated deduction from inventory whenever this item is billed on POS.
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">Selling Price</div>
                      <h3 className="fw-bold text-primary mb-0" suppressHydrationWarning>
                        ₹{formatNumber(selectedRecipe.sellingPrice)}
                      </h3>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="row g-2 mt-3 pt-3 border-top text-center">
                    <div className="col-4">
                      <div className="p-2 bg-light rounded">
                        <div className="text-muted small" style={{ fontSize: '11px' }}>Raw Material Cost</div>
                        <div className="fw-bold text-dark fs-6" suppressHydrationWarning>₹{formatCurrency(selectedRecipe.totalRawCost)}</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 bg-light rounded">
                        <div className="text-muted small" style={{ fontSize: '11px' }}>Food Cost %</div>
                        <div className="fw-bold text-dark fs-6">{selectedRecipe.foodCostPercentage}%</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 bg-light rounded">
                        <div className="text-muted small" style={{ fontSize: '11px' }}>Gross Margin %</div>
                        <div className="fw-bold text-success fs-6">{selectedRecipe.profitMargin}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  <h6 className="fw-bold text-dark small text-uppercase mb-3">Ingredient Cost Breakdown</h6>
                  <div className="table-responsive border rounded mb-4">
                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Raw Material</th>
                          <th className="text-center">Portion Qty</th>
                          <th className="text-end">Vendor Rate</th>
                          <th className="text-end">Subtotal Cost</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {selectedRecipe.ingredients.map((ing, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold text-dark">{ing.name}</td>
                            <td className="text-center">{ing.quantity} {ing.unit}</td>
                            <td className="text-end text-muted" suppressHydrationWarning>₹{formatCurrency(ing.costPerUnit)} / {ing.unit}</td>
                            <td className="text-end fw-bold text-dark" suppressHydrationWarning>₹{formatCurrency(ing.totalCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light small">
                        <tr className="fw-bold">
                          <td colSpan={3} className="text-end text-dark">Total Raw Material Cost:</td>
                          <td className="text-end text-primary" suppressHydrationWarning>₹{formatCurrency(selectedRecipe.totalRawCost)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="alert alert-light border small text-muted mb-0 d-flex align-items-start gap-2">
                    <BiInfoCircle className="text-primary mt-1 flex-shrink-0" size={18} />
                    <div>
                      <strong>Dynamic Cost Sync Active:</strong> Whenever supplier inward invoices change the purchase price of ingredients (e.g. Milk or Chicken), this recipe’s raw cost and margin automatically adjust in real time.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
                Select a dish from the left to view detailed ingredient breakdown.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add Dish Recipe */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleSaveRecipe}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Add New Standardized Recipe</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Dish Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Dal Makhani"
                          required
                          value={newDishName}
                          onChange={(e) => setNewDishName(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Category *</label>
                        <select
                          className="form-select form-select-sm"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        >
                          <option value="Main Course">Main Course</option>
                          <option value="Biryani & Rice">Biryani & Rice</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Pizza">Pizza</option>
                          <option value="Breads">Breads</option>
                          <option value="Desserts">Desserts</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6 col-md-4">
                        <label className="form-label small fw-semibold">Selling Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          required
                          min={1}
                          value={newSellingPrice}
                          onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small fw-semibold">Prep Time (Mins)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={newPrepTime}
                          onChange={(e) => setNewPrepTime(Number(e.target.value))}
                        />
                      </div>
                      <div className="col-12 col-md-4 d-flex align-items-center pt-md-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={newIsVeg}
                            onChange={(e) => setNewIsVeg(e.target.checked)}
                          />
                          <label className="form-check-label small fw-semibold">
                            {newIsVeg ? '🟢 Vegetarian Dish' : '🔴 Non-Vegetarian Dish'}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold small text-dark mb-0">Raw Material Ingredients</h6>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm py-0 px-2"
                          onClick={handleAddIngRow}
                        >
                          <BiPlus /> Add Ingredient
                        </button>
                      </div>

                      <div className="table-responsive">
                        <div style={{ minWidth: '450px' }}>
                          {recipeIngredients.map((it, idx) => (
                            <div key={idx} className="row g-2 align-items-center mb-2">
                              <div className="col-5">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Ingredient (e.g. Urad Dal)"
                                  required
                                  value={it.name}
                                  onChange={(e) => handleUpdateIngRow(idx, 'name', e.target.value)}
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  type="number"
                                  step="0.001"
                                  className="form-control form-control-sm"
                                  placeholder="Qty"
                                  required
                                  value={it.quantity}
                                  onChange={(e) => handleUpdateIngRow(idx, 'quantity', e.target.value)}
                                />
                              </div>
                              <div className="col-2">
                                <select
                                  className="form-select form-select-sm"
                                  value={it.unit}
                                  onChange={(e) => handleUpdateIngRow(idx, 'unit', e.target.value)}
                                >
                                  <option value="kg">kg</option>
                                  <option value="litres">litres</option>
                                  <option value="pcs">pcs</option>
                                </select>
                              </div>
                              <div className="col-2">
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  placeholder="₹/Unit"
                                  required
                                  value={it.costPerUnit}
                                  onChange={(e) => handleUpdateIngRow(idx, 'costPerUnit', e.target.value)}
                                />
                              </div>
                              <div className="col-1 text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm text-danger p-0"
                                  onClick={() => handleRemoveIngRow(idx)}
                                >
                                  <BiTrash size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live calculation banner */}
                      <div className="bg-light p-3 rounded mt-3 d-flex justify-content-between align-items-center small">
                        <div>
                          <span className="text-muted me-1">Estimated Raw Cost:</span>
                          <span className="fw-bold text-dark me-3" suppressHydrationWarning>₹{formatCurrency(calculatedRawCost)}</span>
                          <span className="text-muted me-1">Food Cost %:</span>
                          <span className="fw-bold text-primary">{calculatedFoodCostPct}%</span>
                        </div>
                        <div>
                          <span className="text-muted me-1">Expected Margin:</span>
                          <span className="fw-bold text-success">
                            {(100 - Number(calculatedFoodCostPct)).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Recipe & Map to POS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
