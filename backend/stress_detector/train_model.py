
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import cv2
import pandas as pd
from typing import Tuple, List

def build_model() -> Model:
    """
    Build a stress detection model based on MobileNetV2 architecture
    """
    # Load MobileNetV2 as base model with pre-trained ImageNet weights
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Add custom top layers for stress detection
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)
    
    # Output layer with sigmoid activation for binary classification
    # (stressed vs. not stressed)
    predictions = Dense(1, activation='sigmoid')(x)
    
    # Create the model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def prepare_data(data_dir: str, batch_size: int = 32) -> Tuple[ImageDataGenerator, ImageDataGenerator]:
    """
    Prepare data generators for training and validation
    
    The expected directory structure is:
    data_dir/
        stressed/
            img1.jpg
            img2.jpg
            ...
        not_stressed/
            img1.jpg
            img2.jpg
            ...
    """
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # 20% for validation
    )
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='binary',
        subset='training'
    )
    
    # Load validation data
    validation_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='binary',
        subset='validation'
    )
    
    return train_generator, validation_generator

def train_stress_model(data_dir: str, model_save_path: str, epochs: int = 20, batch_size: int = 32):
    """
    Train the stress detection model and save it
    """
    # Build the model
    model = build_model()
    print("Model built successfully")
    
    # Prepare data generators
    train_generator, validation_generator = prepare_data(data_dir, batch_size)
    print("Data prepared successfully")
    
    # Create callbacks
    checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
        filepath=model_save_path,
        save_best_only=True,
        monitor='val_accuracy',
        mode='max',
        verbose=1
    )
    
    early_stopping_callback = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    )
    
    # Train the model
    print("Starting model training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // batch_size,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // batch_size,
        epochs=epochs,
        callbacks=[checkpoint_callback, early_stopping_callback]
    )
    
    # Save the final model
    model.save(model_save_path)
    print(f"Model saved to {model_save_path}")
    
    # Plot training history
    plot_training_history(history)
    
    # Fine-tune model by unfreezing some layers
    fine_tune_model(model, train_generator, validation_generator, model_save_path, epochs=10)
    
def fine_tune_model(model: Model, train_generator, validation_generator, model_save_path: str, epochs: int = 10):
    """
    Fine-tune the model by unfreezing the last few layers of the base model
    """
    # Unfreeze the last 20 layers
    for layer in model.layers[-20:]:
        layer.trainable = True
    
    # Recompile with a lower learning rate
    model.compile(
        optimizer=Adam(learning_rate=0.00001),  # Lower learning rate for fine-tuning
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Create callbacks
    checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
        filepath=model_save_path,
        save_best_only=True,
        monitor='val_accuracy',
        mode='max',
        verbose=1
    )
    
    # Fine-tune
    print("Starting fine-tuning...")
    history_fine = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // train_generator.batch_size,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // validation_generator.batch_size,
        epochs=epochs,
        callbacks=[checkpoint_callback]
    )
    
    # Save the fine-tuned model
    model.save(model_save_path.replace('.h5', '_fine_tuned.h5'))
    print(f"Fine-tuned model saved")
    
    # Plot fine-tuning history
    plot_training_history(history_fine, title="Fine-tuning History")

def plot_training_history(history, title="Training History"):
    """Plot training history"""
    plt.figure(figsize=(12, 4))
    
    # Plot accuracy
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title(f'{title} - Accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    
    # Plot loss
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title(f'{title} - Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    
    plt.tight_layout()
    
    # Save the plot
    plt.savefig(os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                            'outputs', f'{title.replace(" ", "_").lower()}.png'))
    plt.close()

if __name__ == "__main__":
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_dir = os.path.join(base_dir, 'data', 'stress_images')
    model_save_dir = os.path.join(base_dir, 'stress_detector', 'models')
    
    # Create directories if they don't exist
    os.makedirs(model_save_dir, exist_ok=True)
    os.makedirs(os.path.join(base_dir, 'outputs'), exist_ok=True)
    
    model_save_path = os.path.join(model_save_dir, 'stress_detection_model.h5')
    
    # Train the model
    train_stress_model(data_dir, model_save_path)
