<template>
  <v-container
    class="mx-auto"
    max-width="500"
  >

    <v-container>
      <v-row
        align="center"
        justify="start"
      >
        <v-col
          v-for="selection in selections"
          :key="selection"
          cols="auto"
          class="py-1 pe-0"
        >
          <v-chip
            color="blue"
            variant="elevated"
            closable
            @click:close="removeItem(selection)"
          >
            {{ selection }}
          </v-chip>
        </v-col>

        <v-col cols="12">
          <v-text-field
            id="addTagField"
            v-model="newItem"
            hide-details
            label="Add a tag"
            single-line
            variant="outlined"
            rounded="0"
            @keyup.enter="addItem()"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        color="black"
        variant="outlined"
        rounded="0"
        @click="addItem()"
      >
        Add
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits([
  'addTag', 'removeTag'
]);

const selected = ref<string[]>([]);
const newItem = ref<string>('');


const selections = computed(() => {
  const selections = [];
  for (const selection of selected.value) {
    selections.push(selection);
  }
  return selections;
});


const addItem = () => {
  /**
   * * If the item is not already in the selected list, add it, and emit an event
   * * to the parent component. The parent component needs this data to later send a request.
   */
  const trimmedValue = newItem.value.trim();
  if (!trimmedValue || selected.value.includes(newItem.value)) return;

  selected.value.push(trimmedValue);
  emit('addTag', newItem.value);
  newItem.value = '';
  document.getElementById('addTagField')?.focus();
};

const removeItem = (value: string) => {
  /**
   * Remove the item from the selected list and emit an event
   * to the parent component for it to do the same.
   */
  selected.value = selected.value.filter(v => v !== value);
  emit('removeTag', value);
};

</script>
