<template>
  <v-file-input
    v-model="file"
    :label="label"
    :accept="accept"
    :rules="rules"
    :required="required"
    show-size
    prepend-icon="mdi-paperclip"
    @update:model-value="$emit('update:modelValue', $event)"
  ></v-file-input>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    modelValue: {
      type: File,
      default: null
    },
    label: {
      type: String,
      default: 'Attachment (Optional)'
    },
    accept: {
      type: String,
      default: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    file: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    rules() {
      const rules = []
      if (this.required) {
        rules.push(v => !!v || 'File is required')
      }
      rules.push(
        v => !v || v.size < 5242880 || 'File size must be less than 5MB'
      )
      return rules
    }
  }
}
</script>
