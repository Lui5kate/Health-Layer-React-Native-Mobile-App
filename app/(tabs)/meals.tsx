import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList, Modal, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card, PressableCard } from '@/components/ui/Card';
import { useMealStore } from '@/store/mealStore';
import { getMealsByWeekAndType, categoryLabels, type MealType, type Meal, meals } from '@/data/meals';
import { Spacing, Radius, MealColors } from '@/theme';
import { todayKey, formatDateDisplay } from '@/utils/date';

const WEEKS = [1, 2, 3, 4];
const MEAL_TYPES: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Desayuno' },
  { type: 'lunch', label: 'Comida' },
  { type: 'dinner', label: 'Cena' },
];

// Genera lista de ingredientes (solo nombres, sin cantidades, deduplicados)
function getIngredientNames(mealIds: string[]): Record<string, string[]> {
  const selectedMeals = meals.filter((m) => mealIds.includes(m.id));
  const grouped: Record<string, Set<string>> = {};
  selectedMeals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      if (!grouped[ing.category]) grouped[ing.category] = new Set();
      grouped[ing.category].add(ing.name);
    });
  });
  const result: Record<string, string[]> = {};
  Object.entries(grouped).forEach(([cat, names]) => {
    result[cat] = Array.from(names);
  });
  return result;
}

// ─── MealCard ────────────────────────────────────────────────────────────────
function MealCard({
  meal, isSelected, isCompleted, isInPlan,
  onSelect, onToggleComplete, onTogglePlan,
}: {
  meal: Meal; isSelected: boolean; isCompleted: boolean; isInPlan: boolean;
  onSelect: () => void; onToggleComplete: () => void; onTogglePlan: () => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const typeColors = MealColors[meal.type];

  return (
    <Animated.View layout={Layout.springify()} entering={FadeInDown.duration(400)}>
      <Card
        shadow={isSelected ? 'md' : 'sm'}
        style={[
          styles.mealCard,
          isSelected && { borderWidth: 2, borderColor: colors.primary },
          isCompleted && { opacity: 0.75 },
        ]}
        padding={0}
      >
        {/* Header */}
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.mealHeader}>
          <View style={[styles.mealIcon, { backgroundColor: typeColors.bg }]}>
            <Text style={{ fontSize: 22 }}>{typeColors.icon}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="body" weight="semiBold" numberOfLines={expanded ? undefined : 1}>
              {meal.name}
            </Text>
            <Text variant="caption" color="secondary">
              {meal.ingredients.length} ingredientes
            </Text>
          </View>
          {/* Botón de carrito (plan semanal) */}
          <Pressable
            onPress={onTogglePlan}
            hitSlop={8}
            style={[
              styles.cartBtn,
              { backgroundColor: isInPlan ? colors.primary + '20' : colors.surfaceAlt },
            ]}
          >
            <Text style={{ fontSize: 14 }}>{isInPlan ? '🛒✓' : '🛒'}</Text>
          </Pressable>
          <Text style={{ color: colors.textTertiary, marginLeft: 4, fontSize: 12 }}>
            {expanded ? '▲' : '▼'}
          </Text>
        </Pressable>

        {/* Ingredientes */}
        {expanded && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.ingredients}>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            {meal.notes && (
              <View style={[styles.noteBox, { backgroundColor: colors.primaryLight + '15' }]}>
                <Text variant="caption" color="secondary">💡 {meal.notes}</Text>
              </View>
            )}
            {meal.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredient}>
                <Text variant="caption" style={{ color: colors.textTertiary }}>•</Text>
                <Text variant="bodySmall" style={{ flex: 1 }}>{ing.name}</Text>
                <Text variant="caption" weight="medium" style={{ color: colors.primary }}>
                  {ing.quantity}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Actions */}
        <View style={[styles.mealActions, { borderTopColor: colors.borderLight }]}>
          <Pressable onPress={onSelect} style={styles.actionBtn}>
            <Text variant="caption" weight="semiBold"
              style={{ color: isSelected ? colors.primary : colors.textSecondary }}>
              {isSelected ? '✓ Elegida hoy' : 'Elegir para hoy'}
            </Text>
          </Pressable>
          <Pressable onPress={onToggleComplete} disabled={!isSelected} style={styles.actionBtn}>
            <Text variant="caption" weight="semiBold"
              style={{ color: isCompleted ? colors.success : isSelected ? colors.textSecondary : colors.textTertiary }}>
              {isCompleted ? '✅ Comida' : '⬜ Marcar comida'}
            </Text>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
}

// ─── Modal crear comida ───────────────────────────────────────────────────────
function CreateMealModal({ visible, activeWeek, onClose }: { visible: boolean; activeWeek: number; onClose: () => void }) {
  const { colors } = useTheme();
  const { addCustomMeal } = useMealStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('breakfast');
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;
    setIngredients((prev) => [...prev, trimmed]);
    setNewIngredient('');
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const meal: Meal = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      type,
      week: activeWeek,
      ingredients: ingredients.map((ing) => ({
        name: ing,
        quantity: '',
        category: 'other' as const,
      })),
      notes: notes.trim() || undefined,
    };
    addCustomMeal(meal);
    setName('');
    setType('breakfast');
    setNotes('');
    setIngredients([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={cmStyles.overlay} onPress={onClose}>
        <Pressable style={[cmStyles.sheet, { backgroundColor: colors.bg }]} onPress={() => {}}>
          <View style={[cmStyles.handle, { backgroundColor: colors.border }]} />
          <Text variant="h4" weight="bold" style={{ marginBottom: Spacing.base }}>
            Nueva receta
          </Text>

          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.xs }}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej. Avena con fruta"
            placeholderTextColor={colors.textTertiary}
            style={[cmStyles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          />

          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.xs, marginTop: Spacing.md }}>Tipo</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md }}>
            {MEAL_TYPES.map(({ type: t, label }) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[cmStyles.typeChip, {
                  backgroundColor: type === t ? colors.primary : colors.surface,
                  borderColor: type === t ? colors.primary : colors.border,
                }]}
              >
                <Text variant="caption" weight="semiBold"
                  style={{ color: type === t ? '#FFF' : colors.textSecondary }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.xs }}>Notas (opcional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Consejos de preparación..."
            placeholderTextColor={colors.textTertiary}
            style={[cmStyles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          />

          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.xs, marginTop: Spacing.md }}>
            Ingredientes ({ingredients.length})
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm }}>
            <TextInput
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={handleAddIngredient}
              placeholder="Nombre del ingrediente"
              placeholderTextColor={colors.textTertiary}
              style={[cmStyles.input, { flex: 1, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            />
            <Pressable
              onPress={handleAddIngredient}
              style={[cmStyles.addBtn, { backgroundColor: colors.primary }]}
            >
              <Text variant="body" weight="bold" style={{ color: '#FFF' }}>+</Text>
            </Pressable>
          </View>
          {ingredients.map((ing, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 }}>
              <Text variant="caption" color="secondary">•</Text>
              <Text variant="bodySmall" style={{ flex: 1 }}>{ing}</Text>
              <Pressable onPress={() => setIngredients((prev) => prev.filter((_, j) => j !== i))}>
                <Text variant="caption" style={{ color: colors.error }}>✕</Text>
              </Pressable>
            </View>
          ))}

          <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg }}>
            <Pressable onPress={onClose} style={[cmStyles.cancelBtn, { borderColor: colors.border }]}>
              <Text variant="body" color="secondary">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[cmStyles.saveBtn, { backgroundColor: name.trim() ? colors.primary : colors.border }]}
            >
              <Text variant="body" weight="semiBold" style={{ color: '#FFF' }}>Guardar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cmStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl, paddingBottom: 48, gap: 2 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  input: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14 },
  typeChip: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, alignItems: 'center' },
  addBtn: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center' },
  saveBtn: { flex: 2, paddingVertical: Spacing.md, borderRadius: Radius.lg, alignItems: 'center' },
});

// ─── Lista de compras ─────────────────────────────────────────────────────────
function ShoppingListModal({ week, onClose }: { week: number; onClose: () => void }) {
  const { colors } = useTheme();
  const { getWeeklyPlanMeals } = useMealStore();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const planMealIds = getWeeklyPlanMeals(week);
  const list = getIngredientNames(planMealIds);
  const hasItems = Object.keys(list).length > 0;
  const totalIngredients = Object.values(list).reduce((sum, arr) => sum + arr.length, 0);

  const toggle = (key: string) =>
    setChecked((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
      <View style={styles.modalHeader}>
        <View>
          <Text variant="h4" weight="bold">🛒 Lista de compras</Text>
          <Text variant="caption" color="secondary">
            Semana {week} · {planMealIds.length} recetas · {totalIngredients} ingredientes
          </Text>
        </View>
        <Pressable onPress={onClose}>
          <Text variant="bodySmall" style={{ color: colors.primary }}>Cerrar</Text>
        </Pressable>
      </View>

      {!hasItems ? (
        <View style={styles.emptyCart}>
          <Text style={{ fontSize: 40 }}>🛒</Text>
          <Text variant="body" weight="semiBold" style={{ textAlign: 'center' }}>
            Selecciona recetas para tu lista
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ textAlign: 'center' }}>
            Toca el ícono 🛒 en las recetas que quieres comprar esta semana
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {Object.entries(list).map(([category, names]) => (
            <View key={category} style={{ marginBottom: Spacing.lg }}>
              <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
                {categoryLabels[category] ?? category}
              </Text>
              {names.map((name, i) => {
                const key = `${category}-${name}`;
                const done = checked.has(key);
                return (
                  <Pressable key={i} onPress={() => toggle(key)}
                    style={[styles.shoppingItem, { borderBottomColor: colors.borderLight }]}>
                    <Text style={{ fontSize: 18 }}>{done ? '☑️' : '⬜'}</Text>
                    <Text variant="bodySmall"
                      style={{
                        flex: 1,
                        textDecorationLine: done ? 'line-through' : 'none',
                        color: done ? colors.textTertiary : colors.text,
                      }}>
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function MealsScreen() {
  const { colors } = useTheme();
  const [showShopping, setShowShopping] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>('breakfast');

  const {
    activeWeek, setActiveWeek, selectMeal, toggleMealComplete,
    isMealCompleted, getSelectedMeals, toggleWeeklyMeal,
    isInWeeklyPlan, getWeeklyPlanMeals, customMeals,
  } = useMealStore();

  const today = todayKey();
  const selectedMeals = getSelectedMeals(today);
  const baseMealList = getMealsByWeekAndType(activeWeek, activeMealType);
  const filteredCustom = customMeals.filter((m) => m.type === activeMealType);
  const mealList = [...baseMealList, ...filteredCustom];
  const planCount = getWeeklyPlanMeals(activeWeek).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
        <View>
          <Text variant="h3" weight="bold">Plan nutricional</Text>
          <Text variant="caption" color="secondary">{formatDateDisplay(today)}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Pressable
            onPress={() => setShowCreate(true)}
            style={[styles.shoppingBtn, { backgroundColor: colors.accent + '20' }]}
          >
            <Text style={{ fontSize: 14 }}>✏️</Text>
            <Text variant="caption" weight="semiBold" style={{ color: colors.primary }}>
              + Agregar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowShopping(true)}
            style={[styles.shoppingBtn, { backgroundColor: colors.primary + '15' }]}
          >
            <Text style={{ fontSize: 16 }}>🛒</Text>
            <Text variant="caption" weight="semiBold" style={{ color: colors.primary }}>
              Lista{planCount > 0 ? ` (${planCount})` : ''}
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Selector de semana */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}>
          {WEEKS.map((w) => (
            <Pressable key={w} onPress={() => setActiveWeek(w)}
              style={[styles.weekChip, {
                backgroundColor: activeWeek === w ? colors.primary : colors.surface,
                borderColor: activeWeek === w ? colors.primary : colors.border,
              }]}>
              <Text variant="caption" weight="semiBold"
                style={{ color: activeWeek === w ? '#FFF' : colors.textSecondary }}>
                Semana {w}
              </Text>
              {getWeeklyPlanMeals(w).length > 0 && (
                <Text variant="caption" style={{ color: activeWeek === w ? '#FFF' : colors.primary, fontSize: 10 }}>
                  🛒{getWeeklyPlanMeals(w).length}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Instrucción de carrito */}
      <Animated.View entering={FadeIn.delay(200).duration(400)}>
        <View style={[styles.hint, { backgroundColor: colors.primaryLight + '15' }]}>
          <Text variant="caption" color="secondary">
            💡 Toca 🛒 en cada receta para agregar a tu lista de compras semanal
          </Text>
        </View>
      </Animated.View>

      {/* Tabs de tipo de comida */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.mealTypeTabs}>
        {MEAL_TYPES.map(({ type, label }) => {
          const mealId = selectedMeals[type];
          const done = mealId ? isMealCompleted(today, mealId) : false;
          const typeColors = MealColors[type];
          const active = activeMealType === type;
          return (
            <Pressable key={type} onPress={() => setActiveMealType(type)}
              style={[styles.mealTypeTab, {
                backgroundColor: active ? typeColors.bg : 'transparent',
                borderBottomColor: active ? typeColors.accent : 'transparent',
                borderBottomWidth: 2,
              }]}>
              <Text style={{ fontSize: 16 }}>{typeColors.icon}</Text>
              <Text variant="caption" weight={active ? 'semiBold' : 'regular'}
                style={{ color: active ? typeColors.accent : colors.textSecondary }}>
                {label}
              </Text>
              {done && <Text style={{ fontSize: 10 }}>✅</Text>}
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Lista */}
      <FlatList
        data={mealList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.mealList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            isSelected={selectedMeals[activeMealType] === item.id}
            isCompleted={isMealCompleted(today, item.id)}
            isInPlan={isInWeeklyPlan(activeWeek, item.id)}
            onSelect={() => selectMeal(today, activeMealType, item.id)}
            onToggleComplete={() => toggleMealComplete(today, item.id)}
            onTogglePlan={() => toggleWeeklyMeal(activeWeek, item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>🍽️</Text>
            <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
              No hay recetas para esta semana.
            </Text>
          </View>
        }
      />

      {/* Modal crear comida */}
      <CreateMealModal
        visible={showCreate}
        activeWeek={activeWeek}
        onClose={() => setShowCreate(false)}
      />

      {/* Modal lista de compras */}
      {showShopping && (
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable
            style={[styles.overlay, { backgroundColor: '#00000060' }]}
            onPress={() => setShowShopping(false)}
          />
          <Animated.View entering={FadeInDown.duration(300)}
            style={[styles.shoppingModal, { backgroundColor: colors.bg }]}>
            <ShoppingListModal week={activeWeek} onClose={() => setShowShopping(false)} />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.md,
  },
  shoppingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.lg,
  },
  weekScroll: { paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.md },
  weekChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1,
  },
  hint: {
    marginHorizontal: Spacing.base, marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  mealTypeTabs: { flexDirection: 'row', paddingHorizontal: Spacing.sm, marginBottom: Spacing.sm },
  mealTypeTab: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.sm, gap: 4, flexDirection: 'row', borderRadius: Radius.sm,
  },
  mealList: { paddingHorizontal: Spacing.base, paddingBottom: 120, gap: Spacing.md },
  mealCard: { borderRadius: Radius.xl },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  mealIcon: { width: 50, height: 50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  cartBtn: { padding: 6, borderRadius: Radius.sm },
  divider: { height: 1, marginHorizontal: Spacing.base, marginBottom: Spacing.md },
  ingredients: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md, gap: 2 },
  noteBox: { padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.sm },
  ingredient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3, gap: Spacing.xs },
  mealActions: { flexDirection: 'row', borderTopWidth: 1 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  empty: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing['4xl'] },
  overlay: { ...StyleSheet.absoluteFillObject },
  shoppingModal: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%',
    borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl, paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.base },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  emptyCart: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing['2xl'] },
  shoppingItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
});
